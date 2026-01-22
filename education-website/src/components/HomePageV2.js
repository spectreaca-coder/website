import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV2.css';

import HeaderV2 from './HeaderV2';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import heroBg1 from '../assets/main-bg-v2.jpg';
import heroBg2 from '../assets/hero-bg-2.jpg';
import heroBg4 from '../assets/hero-bg-4.jpg';
import heroBg5 from '../assets/hero-bg-5.jpg';
import heroBgNew1 from '../assets/hero-bg-new-1.png';
import heroBgNew2 from '../assets/hero-bg-new-2.png';
import heroBgNew3 from '../assets/hero-bg-new-3.jpg';
import DirectorNoteV2 from './DirectorNoteV2';
import StudentReviewsV2 from './StudentReviewsV2';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const HomePageV2 = () => {
    const [heroImages] = useState([
        heroBg1, heroBgNew1, heroBg2, heroBgNew2, heroBg4, heroBgNew3, heroBg5
    ]);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    const [recentNotices, setRecentNotices] = useState([]);


    // Firebase에서 공지사항 로드
    useEffect(() => {
        const q = query(
            collection(db, 'notices'),
            orderBy('createdAt', 'desc'),
            limit(3)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notices = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecentNotices(notices);
        });
        return () => unsubscribe();
    }, []);

    // Scroll Reveal Hook
    useScrollReveal();

    // Parallax Effect - Applied to ALL images to prevent jumps on transition
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroBgs = document.querySelectorAll('.hero-bg-image-v2');
            heroBgs.forEach(bg => {
                bg.style.transform = `translateY(${scrollY * 0.5}px)`;
            });
        };

        // Initial call to set position correctly on load
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    // Carousel Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="homepage-v2-container">
            <HeaderV2 />

            {/* Hero Section */}
            <section className="hero-section-v2">
                {heroImages.map((bg, index) => (
                    <div
                        key={index}
                        className={`hero-bg-image-v2 ${index === currentBgIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${bg})` }}
                        role="img"
                        aria-label={`Hero Background ${index + 1}`}
                    />
                ))}
                <div className="hero-bg-overlay-v2"></div>
                <div className="hero-content-v2">

                    <h1 className="hero-title-main-v2 glitch-text" data-text="SPECTRE">SPECTRE</h1>
                    <div className="hero-buttons-v2">
                        <Link to="/register" className="sw-button-v2 primary pulse">수강신청</Link>
                        <Link to="/curriculum" className="sw-button-v2 secondary">수업소개</Link>
                    </div>
                    <div className="social-buttons-v2">
                        <a href="https://www.youtube.com/@daechi_maru" target="_blank" rel="noopener noreferrer" className="social-btn-v2" aria-label="YouTube">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                        <a href="https://www.threads.com/@daechi_spectre?hl=ko" target="_blank" rel="noopener noreferrer" className="social-btn-v2" aria-label="Threads">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.85-.706 2.017-1.12 3.376-1.199.997-.058 1.927.014 2.78.166l-.002-.115c-.022-1.234-.378-2.18-1.027-2.732-.707-.601-1.76-.881-3.13-.832l-.08.003c-1.372.051-2.36.393-2.94.982-.446.453-.737 1.077-.87 1.86l-2.013-.394c.179-1.08.614-2 1.299-2.734.924-.988 2.314-1.527 4.132-1.6l.091-.003c1.821-.062 3.296.342 4.381 1.203 1.177 1.01 1.712 2.452 1.59 4.29-.011.165-.022.33-.034.497.963.382 1.77.914 2.399 1.583.951 1.01 1.507 2.298 1.654 3.83.148 1.538-.195 3.012-1.02 4.382-1.026 1.705-2.746 2.997-5.115 3.839-1.81.643-3.953.973-6.372.981zm.474-8.24c.275-.022.53-.045.764-.07l.014-.002c.93-.1 1.656-.361 2.159-.776.458-.378.72-.897.756-1.5.024-.4-.06-.766-.255-1.097-.14-.236-.339-.44-.583-.606-.072.455-.184.87-.337 1.242-.305.743-.77 1.337-1.38 1.766-.593.418-1.301.67-2.105.753-.254.026-.516.037-.785.034-.694-.009-1.339-.127-1.918-.352-.586-.227-1.057-.564-1.403-1.002-.343-.434-.52-.96-.528-1.563-.007-.511.12-.968.38-1.357.262-.394.644-.71 1.137-.944.472-.223 1.036-.358 1.68-.403.598-.042 1.213-.011 1.833.087l.072.012c.01-.293.014-.572.013-.833-.002-.575-.033-1.083-.094-1.517a8.955 8.955 0 0 0-.232-1.034c-.11-.365-.266-.645-.47-.834-.207-.192-.481-.298-.828-.318-.326-.02-.72.045-1.168.19-.502.163-.918.43-1.24.797-.292.333-.48.746-.564 1.23-.087.504-.049 1.06.114 1.653.29 1.054.884 1.871 1.766 2.43.79.5 1.767.744 2.903.727.275-.004.538-.02.789-.05z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Kinetic Typography Marquee */}
            <div className="marquee-section-v2">
                <div className="marquee-content-v2">
                    <span>스펙터 아카데미 2025학년도 수강생 모집 ● 대치동 최고의 입시 전문가 그룹 ● 최상위권 도약을 위한 완벽한 커리큘럼 ● </span>
                    <span>스펙터 아카데미 2025학년도 수강생 모집 ● 대치동 최고의 입시 전문가 그룹 ● 최상위권 도약을 위한 완벽한 커리큘럼 ● </span>
                </div>
            </div>

            <div className="section-divider-v2"></div>

            {/* Director's Note Section */}
            <DirectorNoteV2 />

            <div className="section-divider-v2"></div>

            {/* Reviews Section - Presentation Style Carousel */}
            <StudentReviewsV2 />

            <div className="section-divider-v2"></div>

            {/* Notices Section - Firebase 연동 */}
            <section className="notices-section-v2" style={{ padding: '50px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h2 className="section-title-v2 reveal-on-scroll">공지사항</h2>
                {recentNotices.length > 0 ? (
                    <ul className="notices-list-v2">
                        {recentNotices.map((notice, index) => (
                            <li key={notice.id} className="notice-item-v2 reveal-on-scroll" style={{ transitionDelay: `${index * 0.1}s` }}>
                                <Link to="/notices" className="notice-link-v2">
                                    <span className="notice-title-text-v2">{notice.title}</span>
                                    <span className="notice-date-v2">
                                        {notice.date || new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ textAlign: 'center', fontFamily: 'Courier New', marginTop: '20px' }}>최근 공지사항이 없습니다.</p>
                )}
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Link to="/notices" style={{ fontWeight: 'bold', textDecoration: 'underline', fontFamily: 'Helvetica Neue', fontSize: '1.2rem' }}>전체 보기 →</Link>
                </div>
            </section>

            {/* Floating KakaoTalk Button */}
            <a
                href="https://open.kakao.com/o/sovpYkzc"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-kakao-btn-v2"
                aria-label="KakaoTalk Consultation"
            >
                <span className="kakao-icon-v2">TALK</span>
            </a>

            <FooterV2 />
        </div>
    );
};

export default HomePageV2;
