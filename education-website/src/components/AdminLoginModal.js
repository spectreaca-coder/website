import React, { useState } from 'react';
import './Modal.css';

const AdminLoginModal = ({ onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 하드코딩된 관리자 계정 (LoginPage.js와 통일)
        // 실제로는 환경변수나 서버 인증을 사용해야 합니다.
        const adminUsername = process.env.REACT_APP_ADMIN_USERNAME || 'specter123';
        const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin1031!';

        console.log('Debug Login Info:', { adminUsername, adminPassword }); // 디버깅용 로그

        if (username === adminUsername && password === adminPassword) {
            sessionStorage.setItem('isAdmin', 'true');
            onLogin();
            onClose();
        } else {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content admin-login-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>🔐 관리자 로그인</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <label>아이디</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control"
                                placeholder="관리자 아이디"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                placeholder="비밀번호"
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="modal-button secondary" onClick={onClose}>취소</button>
                        <button type="submit" className="modal-button primary">로그인</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
