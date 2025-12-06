import React from 'react';
import { Link } from 'react-router-dom';
import './FooterV2.css';

const FooterV2 = () => {
    return (
        <footer className="footer-v2-container">
            <div className="footer-v2-content">
                <div className="footer-v2-top">
                    <div className="footer-v2-brand">
                        <h2>SPECTER<br />ACADEMY</h2>
                    </div>
                    <div className="footer-v2-links">
                        <div className="footer-v2-column">
                            <h3>사이트맵</h3>
                            <Link to="/instructors">강사진</Link>
                            <Link to="/curriculum">수업소개</Link>
                            <Link to="/notices">공지사항</Link>
                            <Link to="/register">수강신청</Link>
                        </div>
                        <div className="footer-v2-column">
                            <h3>SOCIAL</h3>
                            <a href="https://www.youtube.com/@daechi_maru" target="_blank" rel="noopener noreferrer">YOUTUBE</a>
                            <a href="https://www.threads.com/@daechi_spectre?hl=ko" target="_blank" rel="noopener noreferrer">THREADS</a>
                            <a href="https://open.kakao.com/o/sovpYkzc" target="_blank" rel="noopener noreferrer">KAKAO TALK</a>
                        </div>
                    </div>
                </div>

                <div className="footer-v2-bottom">
                    <div className="footer-v2-address">
                        <p>SEOUL, KOREA</p>
                        <p>DAECHI-DONG, GANGNAM-GU</p>
                        <p>TEL: 02-1234-5678</p>
                    </div>
                    <div className="footer-v2-copyright">
                        &copy; 2025 스펙터 아카데미. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterV2;
