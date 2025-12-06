import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import ThreadsPostEditor from './ThreadsPostEditor';
import './HomePage.css'; // Reusing HomePage.css for now, or we can create a separate one

const ThreadsPost = ({ isAdmin, variant = 'default' }) => {
    const [postData, setPostData] = useState({
        content: '오늘도 스펙터 학원의 불은 꺼지지 않습니다. 🔥\n학생들의 열정이 가득한 현장, 신원장이 직접 케어합니다.\n#대치동 #스펙터학원 #열공스타그램',
        timestamp: '2시간 전',
        link: 'https://www.threads.net/@daechi_spectre',
        imageUrl: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Listen for real-time updates
        const unsub = onSnapshot(doc(db, "settings", "threadsPost"), (doc) => {
            if (doc.exists()) {
                setPostData(doc.data());
            }
        });

        return () => unsub();
    }, []);

    const handleEditClick = (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        setIsEditing(true);
    };

    // V3 Minimal Style
    if (variant === 'v3') {
        return (
            <>
                <div className="v3-director-note" style={{ fontFamily: 'Pretendard', color: 'var(--v3-navy)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(20, 36, 138, 0.2)', paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--v3-navy)', color: 'var(--v3-lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: 'Inter' }}>S</div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Director Shin</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{postData.timestamp}</div>
                            </div>
                        </div>
                        {isAdmin && (
                            <button onClick={handleEditClick} style={{ background: 'none', border: '1px solid var(--v3-navy)', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                EDIT
                            </button>
                        )}
                    </div>

                    <div style={{ fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {postData.content}
                    </div>

                    {postData.imageUrl && (
                        <div style={{ marginTop: '1rem' }}>
                            <img src={postData.imageUrl} alt="Director's Note" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                        </div>
                    )}
                </div>

                {isEditing && (
                    <ThreadsPostEditor
                        initialData={postData}
                        onClose={() => setIsEditing(false)}
                    />
                )}
            </>
        );
    }

    // Default V2 Style
    return (
        <>
            <a href={postData.link} target="_blank" rel="noopener noreferrer" className="threads-card">
                <div className="card-header">
                    <div className="user-info">
                        <div className="avatar-wrapper">
                            {/* Placeholder avatar or we can add an image upload later */}
                            <div className="avatar-placeholder">S</div>
                        </div>
                        <div className="username-container">
                            <span className="username">daechi_spectre</span>
                            <span className="timestamp">{postData.timestamp}</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        {isAdmin && (
                            <button className="edit-threads-btn" onClick={handleEditClick}>
                                수정
                            </button>
                        )}
                        <svg className="threads-logo" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.28 0 2.47-.4 3.46-1.09.66.67 1.58 1.09 2.54 1.09 2.21 0 4-1.79 4-4s-1.79-4-4-4c-1.86 0-3.43 1.28-3.87 3.02-.08.31-.13.63-.13.98 0 2.21 1.79 4 4 4 .92 0 1.77-.31 2.46-.84.4.57.64 1.26.64 2.01 0 1.59-1.06 2.94-2.52 3.35C17.23 16.88 14.76 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.36 0 2.61.45 3.61 1.21L14.5 8.3C13.77 7.8 12.91 7.5 12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5c1.04 0 2-.35 2.77-.94-.3-.43-.48-.95-.48-1.51 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.14-.78 2.1-1.84 2.39-.86.23-1.77.36-2.71.36-2.76 0-5-2.24-5-5s2.24-5 5-5c1.15 0 2.22.39 3.08 1.05l1.1-1.1C15.19 6.74 13.67 6 12 6z" />
                        </svg>
                    </div>
                </div>
                <div className="card-content">
                    {postData.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                    {postData.imageUrl && (
                        <div className="post-image-container">
                            <img src={postData.imageUrl} alt="Threads post content" className="post-image" />
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <span className="footer-icon">❤️</span>
                    <span className="footer-icon">💬</span>
                    <span className="footer-icon">↻</span>
                    <span className="footer-icon">✈️</span>
                </div>
            </a>

            {isEditing && (
                <ThreadsPostEditor
                    initialData={postData}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
};

export default ThreadsPost;
