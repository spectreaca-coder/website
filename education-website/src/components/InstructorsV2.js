import React, { useState, useEffect, useRef } from 'react';
import './InstructorsV2.css';
import FooterV2 from './FooterV2';
import HeaderV2 from './HeaderV2';
import Modal from './Modal';
import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const InstructorsV2 = () => {
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [messageModal, setMessageModal] = useState({ show: false, message: '', type: 'success' }); // 'success' or 'error'
    const [isImagePickModalOpen, setIsImagePickModalOpen] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const fileInputRef = useRef(null);

    // Helper to replace alert
    const showMessage = (message, type = 'success') => {
        setMessageModal({ show: true, message, type });
    };

    const closeMessage = () => {
        setMessageModal({ show: false, message: '', type: 'success' });
    };

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        bio: '',
        tags: '',
        imageUrl: '',
        imageFile: null,
        imagePreview: '',
        order: 0
    });

    // 관리자 상태 확인
    useEffect(() => {
        const checkAdmin = () => {
            const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
            setIsAdmin(adminFlag);
        };
        checkAdmin();
        const interval = setInterval(checkAdmin, 1000);
        return () => clearInterval(interval);
    }, []);

    // Firebase에서 강사진 로드
    useEffect(() => {
        const q = query(collection(db, 'instructors'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setInstructors(data);
            setIsLoading(false);
        }, (error) => {
            console.error('강사진 로드 실패:', error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 이미지 선택 (File Input Trigger)
    const handleFileSelectTrigger = () => {
        fileInputRef.current?.click();
        setIsImagePickModalOpen(false);
    };

    // 이미지 선택 핸들러 (Change Event)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage('파일 크기는 5MB 이하여야 합니다.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // 에디터 열기
    const openEditor = (instructor = null) => {
        if (instructor) {
            setEditingInstructor(instructor);
            setFormData({
                name: instructor.name || '',
                subject: instructor.subject || '',
                bio: instructor.bio || '',
                tags: Array.isArray(instructor.tags) ? instructor.tags.join(', ') : '',
                imageUrl: instructor.imageUrl || '',
                imageFile: null,
                imagePreview: instructor.imageUrl || '',
                order: instructor.order || 0
            });
        } else {
            setEditingInstructor(null);
            setFormData({
                name: '',
                subject: '',
                bio: '',
                tags: '',
                imageUrl: '',
                imageFile: null,
                imagePreview: '',
                order: instructors.length + 1
            });
        }
        setIsEditorOpen(true);
    };

    // 저장
    const handleSave = async (e) => {
        e.preventDefault();
        let imageUrl = formData.imageUrl;

        if (formData.imageFile) {
            try {
                const fileName = `instructors/${Date.now()}_${formData.imageFile.name}`;
                const storageRef = ref(storage, fileName);
                await uploadBytes(storageRef, formData.imageFile);
                imageUrl = await getDownloadURL(storageRef);
            } catch (error) {
                showMessage('이미지 업로드에 실패했습니다.', 'error');
                return;
            }
        }

        const instructorData = {
            name: formData.name,
            subject: formData.subject,
            bio: formData.bio,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            imageUrl: imageUrl,
            order: parseInt(formData.order) || 0,
            updatedAt: new Date().toISOString()
        };

        try {
            if (editingInstructor) {
                await updateDoc(doc(db, 'instructors', editingInstructor.id), instructorData);
                showMessage('강사 정보가 수정되었습니다.');
            } else {
                instructorData.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'instructors'), instructorData);
                showMessage('새 강사가 추가되었습니다.');
            }
            setIsEditorOpen(false);
        } catch (error) {
            console.error('저장 실패:', error);
            showMessage('저장에 실패했습니다.', 'error');
        }
    };

    // 삭제
    const showDeleteConfirmModal = (id) => {
        setDeleteConfirm({ show: true, id: id });
    };

    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });
        try {
            await deleteDoc(doc(db, 'instructors', id));
            showMessage('강사가 삭제되었습니다.');
        } catch (error) {
            console.error('삭제 실패:', error);
            showMessage('삭제에 실패했습니다.', 'error');
        }
    };

    return (
        <div className="instructors-page">
            <div className="noise-overlay-v2"></div>
            <HeaderV2 />

            <main className="instructors-main">
                <div className="instructors-content">
                    {/* ... (Header & Buttons remain same) ... */}
                    <div className="instructors-header">
                        <h1 className="instructors-title">강사진</h1>
                        {isAdmin && (
                            <button className="add-btn" onClick={() => openEditor()}>
                                + 강사 추가
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading">로딩 중...</div>
                    ) : instructors.length === 0 ? (
                        <div className="empty">등록된 강사가 없습니다.</div>
                    ) : (
                        <div className="instructors-grid">
                            {instructors.map((instructor) => (
                                <div key={instructor.id} className="instructor-card">
                                    <div className="card-image">
                                        {instructor.imageUrl ? (
                                            <img src={instructor.imageUrl} alt={instructor.name} />
                                        ) : (
                                            <div className="placeholder">{instructor.name?.charAt(0) || '?'}</div>
                                        )}
                                    </div>
                                    <div className="card-info">
                                        <h2 className="card-name">{instructor.name}</h2>
                                        <p className="card-subject">{instructor.subject}</p>
                                        <p className="card-bio">{instructor.bio}</p>
                                        {instructor.tags && instructor.tags.length > 0 && (
                                            <div className="card-tags">
                                                {instructor.tags.map((tag, i) => (
                                                    <span key={i} className="tag">#{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                        {isAdmin && (
                                            <div className="card-actions">
                                                <button onClick={() => openEditor(instructor)}>수정</button>
                                                <button className="delete" onClick={() => showDeleteConfirmModal(instructor.id)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* 에디터 모달 */}
            {isEditorOpen && (
                <Modal onClose={() => setIsEditorOpen(false)}>
                    <form onSubmit={handleSave} className="editor-form">
                        <h2>{editingInstructor ? '강사 정보 수정' : '새 강사 추가'}</h2>

                        <div className="form-group">
                            <label>이름</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>과목</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>소개</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>태그 (쉼표로 구분)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="예: 수학, 미적분"
                            />
                        </div>

                        <div className="form-group">
                            <label>프로필 사진</label>
                            {/* 이미지 미리보기 및 클릭 시 팝업 오픈 */}
                            <div
                                className="image-preview-container"
                                onClick={() => setIsImagePickModalOpen(true)}
                            >
                                {formData.imagePreview ? (
                                    <div className="image-preview">
                                        <img src={formData.imagePreview} alt="미리보기" />
                                        <div className="overlay-text">📷 사진 변경</div>
                                    </div>
                                ) : (
                                    <div className="image-upload-placeholder">
                                        📷 사진 추가
                                    </div>
                                )}
                            </div>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>정렬 순서</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="button" onClick={() => setIsEditorOpen(false)}>취소</button>
                            <button type="submit" className="primary">저장</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* 이미지 선택 방식 모달 */}
            {isImagePickModalOpen && (
                <Modal onClose={() => setIsImagePickModalOpen(false)}>
                    <div className="image-pick-modal">
                        <h3>이미지 올리기</h3>
                        <p>컴퓨터에서 이미지를 선택해주세요.</p>
                        <div className="pick-buttons">
                            <button className="pick-btn primary" onClick={handleFileSelectTrigger}>
                                파일 선택
                            </button>
                            {formData.imagePreview && (
                                <button className="pick-btn delete" onClick={() => {
                                    setFormData({ ...formData, imageFile: null, imagePreview: '', imageUrl: '' });
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                    setIsImagePickModalOpen(false);
                                }}>
                                    이미지 삭제
                                </button>
                            )}
                            <button className="pick-btn cancel" onClick={() => setIsImagePickModalOpen(false)}>
                                취소
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* 메시지 모달 (Alert 대체) */}
            {messageModal.show && (
                <div className="message-modal-overlay">
                    <div className={`message-modal ${messageModal.type}`}>
                        <p>{messageModal.message}</p>
                        <button onClick={closeMessage}>확인</button>
                    </div>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            {deleteConfirm.show && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p>정말로 이 강사를 삭제하시겠습니까?</p>
                        <div className="confirm-buttons">
                            <button onClick={() => setDeleteConfirm({ show: false, id: null })}>취소</button>
                            <button className="delete" onClick={confirmDelete}>삭제</button>
                        </div>
                    </div>
                </div>
            )}

            <FooterV2 />
        </div>
    );
};

export default InstructorsV2;
