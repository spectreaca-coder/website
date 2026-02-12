import React, { useState, useEffect } from 'react';
import './CurriculumV2.css';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import HeaderV2 from './HeaderV2';
import Modal from './Modal';
import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Register custom font sizes
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
Quill.register(Size, true);

const CurriculumV2 = () => {
    const [curriculum, setCurriculum] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [activeWeek, setActiveWeek] = useState(0);

    // 삭제 확인 모달 상태
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mediaUrl: '',
        mediaFile: null,
        order: 0
    });

    // ReactQuill Modules
    const modules = {
        toolbar: [
            [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
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

    // Firebase에서 커리큘럼 로드
    useEffect(() => {
        const q = query(collection(db, 'curriculum'), orderBy('order', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCurriculum(data);
            setIsLoading(false);
        }, (error) => {
            console.error('커리큘럼 로드 실패:', error);
            // 기본 데이터
            setCurriculum([
                { id: '1', title: 'Foundation & Mindset', content: '<p>스펙터 아카데미의 기본 철학과 학습 마인드셋을 다룹니다.</p>', order: 1 },
                { id: '2', title: 'Design Principles', content: '<p>디자인의 핵심 원칙과 시각적 커뮤니케이션을 배웁니다.</p>', order: 2 },
            ]);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 에디터 열기
    const openEditor = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title || '',
                content: item.content || '',
                mediaUrl: item.mediaUrl || '',
                mediaFile: null,
                order: item.order || 0
            });
        } else {
            setEditingItem(null);
            setFormData({ title: '', content: '', mediaUrl: '', mediaFile: null, order: curriculum.length + 1 });
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
                const storageRef = ref(storage, `curriculum/${Date.now()}_${formData.mediaFile.name}`);
                await uploadBytes(storageRef, formData.mediaFile);
                downloadUrl = await getDownloadURL(storageRef);
            }

            const itemData = {
                title: formData.title,
                content: formData.content, // HTML Content
                mediaUrl: downloadUrl, // mediaUrl is now just the representative image
                order: parseInt(formData.order) || 0,
                updatedAt: new Date().toISOString()
            };

            if (editingItem) {
                await updateDoc(doc(db, 'curriculum', editingItem.id), itemData);
                alert('커리큘럼이 수정되었습니다.');
            } else {
                itemData.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'curriculum'), itemData);
                alert('새 커리큘럼이 추가되었습니다.');
            }
            setIsEditorOpen(false);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
        }
    };

    // 삭제 확인 모달 표시
    const showDeleteConfirm = (id) => {
        setDeleteConfirm({ show: true, id: id });
    };

    // 삭제 확정
    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });

        try {
            await deleteDoc(doc(db, 'curriculum', id));
            alert('커리큐럼이 삭제되었습니다.');
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제에 실패했습니다: ' + error.message);
        }
    };

    useScrollReveal('.reveal-on-scroll', 0.1, [curriculum]);

    return (
        <div className="curriculum-v2-page">
            <div className="noise-overlay-v2"></div>

            <HeaderV2 />

            <main className="curriculum-v2-main">
                <div className="curriculum-v2-content">
                    <div className="curriculum-v2-header">
                        <h1 className="curriculum-v2-title reveal-on-scroll">수업소개</h1>
                        {isAdmin && (
                            <button className="admin-add-btn" onClick={() => openEditor()}>
                                + 항목 추가
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading-message">Loading...</div>
                    ) : (
                        <>
                            {/* PC: 매거진 스타일 */}
                            <div className="curriculum-magazine">
                                {curriculum.map((item, index) => (
                                    <section key={item.id} className="curriculum-section reveal-on-scroll">
                                        <div className="curriculum-section-header">
                                            {/* Week 표시 제거 */}
                                            <h2 className="curriculum-section-title">{item.title}</h2>
                                            {isAdmin && (
                                                <div className="curriculum-admin-actions">
                                                    <button onClick={() => openEditor(item)}>수정</button>
                                                    <button onClick={() => showDeleteConfirm(item.id)} className="delete">삭제</button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="curriculum-section-content">
                                            {item.mediaUrl && (
                                                <div className="curriculum-media">
                                                    {/* mediaUrl은 이제 대표 이미지입니다 */}
                                                    <img src={item.mediaUrl} alt={item.title} />
                                                </div>
                                            )}

                                            <div className="curriculum-text">
                                                <div className="curriculum-description html-content" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                                {/* Details 목록 제거 */}
                                            </div>
                                        </div>
                                    </section>
                                ))}
                            </div>

                            {/* Mobile: 카드 슬라이더 */}
                            <div className="curriculum-slider">
                                <div className="slider-tabs">
                                    {curriculum.map((item, index) => (
                                        <button
                                            key={item.id}
                                            className={`slider-tab ${activeWeek === index ? 'active' : ''}`}
                                            onClick={() => setActiveWeek(index)}
                                        >
                                            {item.title} {/* Week 대신 Title 표시 */}
                                        </button>
                                    ))}
                                </div>

                                {curriculum[activeWeek] && (
                                    <div className="slider-content">
                                        <h2 className="slider-title">{curriculum[activeWeek].title}</h2>

                                        {curriculum[activeWeek].mediaUrl && (
                                            <div className="slider-media">
                                                {/* 모바일에서도 대표 이미지로 처리 */}
                                                <img src={curriculum[activeWeek].mediaUrl} alt={curriculum[activeWeek].title} />
                                            </div>
                                        )}

                                        <div className="slider-description html-content" dangerouslySetInnerHTML={{ __html: curriculum[activeWeek].content }}></div>
                                        {/* Details 목록 제거 */}

                                        {isAdmin && (
                                            <div className="slider-admin-actions">
                                                <button onClick={() => openEditor(curriculum[activeWeek])}>수정</button>
                                                <button onClick={() => showDeleteConfirm(curriculum[activeWeek].id)} className="delete">삭제</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Editor Modal */}
            {isEditorOpen && (
                <Modal onClose={() => setIsEditorOpen(false)} disableOutsideClick={true}>
                    <form onSubmit={handleSave} className="curriculum-editor-form">
                        <h2>{editingItem ? '항목 수정' : '새 항목 추가'}</h2>

                        <div className="form-group">
                            <label>순서</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>제목</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Foundation & Mindset"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>설명</label>
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
                        <p>정말로 이 커리큐럼을 삭제하시겠습니까?</p>
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


export default CurriculumV2;
