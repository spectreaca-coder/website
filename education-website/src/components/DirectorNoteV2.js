import React, { useState, useEffect } from 'react';
import './DirectorNoteV2.css';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Modal from './Modal';

const DirectorNoteV2 = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [noteData, setNoteData] = useState({
        title: "DIRECTOR'S NOTE",
        date: '2024.11.29',
        content1: '"진정한 교육은 단순히 지식을 전달하는 것이 아니라, 학생 스스로 생각하고 질문하는 힘을 길러주는 것입니다."',
        content2: '스펙터 아카데미는 대치동의 치열한 경쟁 속에서도 흔들리지 않는 본질적인 실력을 추구합니다. 우리는 단순한 입시 성공을 넘어, 더 넓은 세상으로 나아갈 수 있는 단단한 기반을 만듭니다.',
        signature: '- Director Shin'
    });
    const [formData, setFormData] = useState({ ...noteData });

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

    // Firebase에서 데이터 로드
    useEffect(() => {
        const loadNote = async () => {
            try {
                const docRef = doc(db, 'settings', 'directorNote');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNoteData(data);
                    setFormData(data);
                }
            } catch (error) {
                console.error('Director Note 로드 실패:', error);
            }
        };
        loadNote();
    }, []);

    // 저장
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // 현재 날짜로 자동 업데이트
            const today = new Date();
            const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
            const updatedData = { ...formData, date: dateStr };

            await setDoc(doc(db, 'settings', 'directorNote'), updatedData);
            setNoteData(updatedData);
            setFormData(updatedData);
            setIsEditing(false);
            alert('저장되었습니다.');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
        }
    };

    return (
        <section className="director-note-section-v2">
            <div className="director-note-container-v2">
                <div className="note-header-v2">
                    <h2 className="note-title-v2">{noteData.title}</h2>
                    <span className="note-date-v2">{noteData.date}</span>
                    {isAdmin && (
                        <button className="note-edit-btn" onClick={() => {
                            setFormData({ ...noteData });
                            setIsEditing(true);
                        }}>수정</button>
                    )}
                </div>
                <div className="note-content-v2">
                    <p>{noteData.content1}</p>
                    <p>{noteData.content2}</p>
                    <p className="note-signature-v2">{noteData.signature}</p>
                </div>
                <div className="note-footer-deco-v2">
                    <span>VERITAS</span>
                    <span>LUX</span>
                    <span>MEA</span>
                </div>
            </div>

            {/* 에디터 모달 */}
            {isEditing && (
                <Modal onClose={() => setIsEditing(false)}>
                    <form onSubmit={handleSave} className="director-note-form">
                        <h2>Director's Note 수정</h2>

                        <div className="form-group">
                            <label>날짜</label>
                            <input
                                type="text"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>첫 번째 문단</label>
                            <textarea
                                value={formData.content1}
                                onChange={(e) => setFormData({ ...formData, content1: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>두 번째 문단</label>
                            <textarea
                                value={formData.content2}
                                onChange={(e) => setFormData({ ...formData, content2: e.target.value })}
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label>서명</label>
                            <input
                                type="text"
                                value={formData.signature}
                                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="button" onClick={() => setIsEditing(false)}>취소</button>
                            <button type="submit" className="primary">저장</button>
                        </div>
                    </form>
                </Modal>
            )}
        </section>
    );
};

export default DirectorNoteV2;
