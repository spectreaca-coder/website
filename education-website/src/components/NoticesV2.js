import React, { useState, useEffect } from 'react';
import './NoticesV2.css';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import HeaderV2 from './HeaderV2';
import Modal from './Modal';
import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoticesV2 = () => {
    const [notices, setNotices] = useState([]);
    const [openNotice, setOpenNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);

    // 삭제 확인 모달 상태
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mediaUrl: '',
        mediaFile: null
    });

    // ReactQuill Modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'], // Added video support
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video' // Added video format
    ];

    // 관리자 상태 확인
    useEffect(() => {
        const checkAdmin = () => {
            setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
        };
        checkAdmin();
        const interval = setInterval(checkAdmin, 1000);
        return () => clearInterval(interval);
    }, []);

    // Firebase에서 공지사항 로드
    useEffect(() => {
        const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotices(data);
            setIsLoading(false);
        }, (error) => {
            console.error('공지사항 로드 실패:', error);
            setNotices([
                { id: '1', title: '2025년 상반기 수강신청 안내', date: '2024.11.28', content: '<p>2025년 상반기 수강신청이 시작되었습니다.</p>' },
                { id: '2', title: '겨울방학 특강 개설 안내', date: '2024.11.15', content: '<p>겨울방학을 맞아 특별 강의가 개설됩니다.</p>' },
            ]);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleNotice = (id) => {
        setOpenNotice(openNotice === id ? null : id);
    };

    // 에디터 열기
    const openEditor = (notice = null) => {
        if (notice) {
            setEditingNotice(notice);
            setFormData({
                title: notice.title || '',
                content: notice.content || '',
                mediaUrl: notice.mediaUrl || '',
                mediaFile: null
            });
        } else {
            setEditingNotice(null);
            setFormData({ title: '', content: '', mediaUrl: '', mediaFile: null });
        }
        setIsEditorOpen(true);
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, mediaFile: e.target.files[0] });
        }
    };

    // 저장
    const handleSave = async (e) => {
        e.preventDefault();

        try {
            let downloadUrl = formData.mediaUrl;

            // 파일이 선택되었다면 업로드
            if (formData.mediaFile) {
                const storageRef = ref(storage, `notices/${Date.now()}_${formData.mediaFile.name}`);
                await uploadBytes(storageRef, formData.mediaFile);
                downloadUrl = await getDownloadURL(storageRef);
            }

            const noticeData = {
                title: formData.title,
                content: formData.content,
                mediaUrl: downloadUrl,
                updatedAt: new Date().toISOString()
            };

            if (editingNotice) {
                await updateDoc(doc(db, 'notices', editingNotice.id), noticeData);
                alert('공지사항이 수정되었습니다.');
            } else {
                noticeData.createdAt = new Date().toISOString();
                noticeData.date = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', '');
                await addDoc(collection(db, 'notices'), noticeData);
                alert('새 공지사항이 등록되었습니다.');
            }
            setIsEditorOpen(false);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다: ' + error.message);
        }
    };

    // 삭제 확인 모달 표시
    const showDeleteConfirm = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteConfirm({ show: true, id: id });
    };

    // 삭제 확정
    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });

        try {
            await deleteDoc(doc(db, 'notices', id));
            alert('공지사항이 삭제되었습니다.');
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제에 실패했습니다: ' + error.message);
        }
    };

    useScrollReveal('.reveal-on-scroll', 0.1, [notices]);

    return (
        <div className="notices-v2-page">
            <div className="noise-overlay-v2"></div>

            <HeaderV2 />

            <main className="notices-v2-main">
                <div className="notices-v2-content">
                    <div className="notices-v2-header">
                        <h1 className="notices-v2-title reveal-on-scroll">공지사항</h1>
                        {isAdmin && (
                            <button className="admin-add-btn" onClick={() => openEditor()}>
                                + 공지 추가
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading-message">Loading...</div>
                    ) : (
                        <div className="notices-v2-list">
                            {notices.map((notice, index) => (
                                <div
                                    key={notice.id}
                                    className="notices-v2-item reveal-on-scroll"
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <div
                                        className={`notices-v2-item-header ${openNotice === notice.id ? 'active' : ''}`}
                                        onClick={() => toggleNotice(notice.id)}
                                    >
                                        <div className="notices-v2-item-left">
                                            <span className="notices-v2-date">{notice.date}</span>
                                            <h3 className="notices-v2-item-title">{notice.title}</h3>
                                        </div>
                                        <div className="notices-v2-item-right">
                                            {isAdmin && (
                                                <div className="notices-admin-actions">
                                                    <button onClick={(e) => { e.stopPropagation(); openEditor(notice); }}>수정</button>
                                                    <button onClick={(e) => showDeleteConfirm(notice.id, e)} className="delete">삭제</button>
                                                </div>
                                            )}
                                            <span className="notices-v2-toggle">
                                                {openNotice === notice.id ? '−' : '+'}
                                            </span>
                                        </div>
                                    </div>

                                    {openNotice === notice.id && (
                                        <div className="notices-v2-details">
                                            {notice.mediaUrl && (
                                                <div className="notices-media">
                                                    {/* mediaUrl은 이제 항상 대표 이미지로 간주 */}
                                                    <img src={notice.mediaUrl} alt={notice.title} />
                                                </div>
                                            )}
                                            {/* Render HTML Content */}
                                            <div className="notices-content html-content" dangerouslySetInnerHTML={{ __html: notice.content }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Editor Modal */}
            {isEditorOpen && (
                <Modal onClose={() => setIsEditorOpen(false)}>
                    <form onSubmit={handleSave} className="notices-editor-form">
                        <h2>{editingNotice ? '공지사항 수정' : '새 공지사항'}</h2>

                        <div className="form-group">
                            <label>제목</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="공지사항 제목"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>내용</label>
                            {/* React Quill Editor */}
                            <ReactQuill
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                                style={{ height: '300px', marginBottom: '50px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>대표 이미지 (선택)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {formData.mediaUrl && !formData.mediaFile && (
                                <p className="file-info">현재 이미지: <a href={formData.mediaUrl} target="_blank" rel="noopener noreferrer">보기</a></p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={() => setIsEditorOpen(false)} className="cancel-btn">취소</button>
                            <button type="submit" className="save-btn">저장</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* 삭제 확인 모달 */}
            {deleteConfirm.show && (
                <div className="confirm-modal-overlay" onClick={() => setDeleteConfirm({ show: false, id: null })}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <p>정말로 이 공지사항을 삭제하시겠습니까?</p>
                        <div className="confirm-modal-actions">
                            <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="cancel-btn">취소</button>
                            <button onClick={confirmDelete} className="delete-btn">삭제</button>
                        </div>
                    </div>
                </div>
            )}

            <FooterV2 />
        </div>
    );
};

export default NoticesV2;
