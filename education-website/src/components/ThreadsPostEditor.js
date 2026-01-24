import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './Modal.css'; // Reusing Modal styles

const ThreadsPostEditor = ({ initialData, onClose }) => {
    const [content, setContent] = useState(initialData.content);
    const [timestamp, setTimestamp] = useState(initialData.timestamp);
    const [link, setLink] = useState(initialData.link);
    const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setDoc(doc(db, "settings", "threadsPost"), {
                content,
                timestamp,
                link,
                imageUrl
            });
            onClose();
        } catch (error) {
            console.error("Error saving post:", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Threads 포스트 수정</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="5"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>시간 표시 (예: 2시간 전)</label>
                        <input
                            type="text"
                            value={timestamp}
                            onChange={(e) => setTimestamp(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>링크 URL</label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>이미지 URL (선택사항)</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="form-control"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-button secondary" onClick={onClose}>취소</button>
                    <button
                        className="modal-button primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThreadsPostEditor;
