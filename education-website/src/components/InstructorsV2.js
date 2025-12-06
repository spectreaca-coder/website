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
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const fileInputRef = useRef(null);

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

    // 이미지 선택
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('파일 크기는 5MB 이하여야 합니다.');
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
                alert('이미지 업로드에 실패했습니다.');
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
                alert('강사 정보가 수정되었습니다.');
            } else {
                instructorData.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'instructors'), instructorData);
                alert('새 강사가 추가되었습니다.');
            }
            setIsEditorOpen(false);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
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
            alert('강사가 삭제되었습니다.');
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    return (
        <div className="instructors-page">
            <HeaderV2 />

            <main className="instructors-main">
                <div className="instructors-content">
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
                            {formData.imagePreview ? (
                                <div className="image-preview">
                                    <img src={formData.imagePreview} alt="미리보기" />
                                    <button type="button" onClick={() => {
                                        setFormData({ ...formData, imageFile: null, imagePreview: '', imageUrl: '' });
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}>제거</button>
                                </div>
                            ) : (
                                <div className="image-upload" onClick={() => fileInputRef.current?.click()}>
                                    📷 클릭하여 이미지 선택
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
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
