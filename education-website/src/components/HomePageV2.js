import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV2.css';

import HeaderV2 from './HeaderV2';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import DailyBriefing from './DailyBriefing';
import heroBg1 from '../assets/main-bg-v2.jpg';
import heroBg2 from '../assets/hero-bg-2.jpg';
import heroBg3 from '../assets/hero-bg-3.jpg';
import heroBg4 from '../assets/hero-bg-4.jpg';
import heroBg5 from '../assets/hero-bg-5.jpg';
import heroBg6 from '../assets/hero-bg-6.jpg';
import heroBg7 from '../assets/hero-bg-7.jpg';
import logo from '../assets/logo.png';
import DirectorNoteV2 from './DirectorNoteV2';



const HomePageV2 = () => {
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Moved to HeaderV2
    const [heroImages, setHeroImages] = useState([
        heroBg1, heroBg2, heroBg3, heroBg4, heroBg5, heroBg6, heroBg7
    ]);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [seoulTime, setSeoulTime] = useState(''); // Kept for Hero section display if needed, but HeaderV2 has its own.
    // Wait, the Hero section ALSO displays the time in the middle. I should keep seoulTime logic here for the Hero section.
    // Or I can remove it from Hero if it's in the header?
    // The design shows it in the header AND potentially in the hero?
    // Looking at previous code: <div className="seoul-clock-v2">{seoulTime}</div> was in the Hero content too?
    // No, line 178: <div className="seoul-clock-v2">{seoulTime}</div> is inside .hero-content-v2.
    // And line 131 (in previous file view, but not in the snippet I replaced) had it in header?
    // Let's check the previous file view of HomePageV2.js (Step 822).
    // Line 178 is inside .hero-content-v2.
    // Line 134-163 was the header. It did NOT have the clock in the header in the previous version!
    // But HeaderV2 added it.
    // If I add it to HeaderV2, do I still need it in Hero?
    // The user asked for "Unification". The sub-pages had the clock in the header (e.g. InstructorsV2 line 131).
    // HomePageV2 had it in the Hero.
    // To unify, maybe we should have it in the Header for ALL pages, including Home?
    // Or keep it in Hero for Home and Header for others?
    // The "Design Debate" mentioned "Seoul Clock" in the header context.
    // I will keep the logic here for the Hero section if it's used there, but HeaderV2 handles the header one.
    // Actually, looking at the code I replaced in HomePageV2 (lines 134-163), it did NOT have the clock.
    // So HomePageV2 only had it in the Hero.
    // InstructorsV2 had it in the Header.
    // I will keep the logic in HomePageV2 for the Hero section clock.

    const [scrolled, setScrolled] = useState(false); // Used for parallax

    // Reviews Data
    const reviews = [
        { id: 1, name: '김OO', course: '영어 심화반', rating: 5, comment: '스펙터 아카데미 덕분에 내신 1등급 받았습니다! 원장님의 전략적인 접근이 정말 큰 도움이 되었어요.', date: '2024.10.15' },
        { id: 2, name: '이OO', course: '수학 집중반', rating: 5, comment: '수학이 너무 어려웠는데, 제임스 선생님 강의 듣고 자신감이 생겼습니다. 문제 풀이 속도가 확실히 빨라졌어요.', date: '2024.10.12' },
        { id: 3, name: '박OO', course: '국어 논술', rating: 4, comment: '논술 첨삭이 정말 꼼꼼합니다. 글쓰기 실력이 많이 늘었어요.', date: '2024.10.08' },
        { id: 4, name: '최OO', course: '과학 탐구', rating: 5, comment: '실험 중심 수업이라 이해가 잘 됩니다. 물리 성적이 많이 올랐어요.', date: '2024.10.05' },
    ];

    // Notices Data
    const recentNotices = [
        { id: 1, title: '2025년 상반기 수강신청 안내', createdAt: '2024.11.28' },
        { id: 2, title: '겨울방학 특강 개설 안내', createdAt: '2024.11.15' },
        { id: 3, title: '강사진 변경 안내', createdAt: '2024.11.01' },
    ];

    // const toggleMobileMenu = () => {setIsMobileMenuOpen(!isMobileMenuOpen); }; // Moved to HeaderV2

    // Scroll Reveal Hook
    useScrollReveal();

    // Parallax Effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroBg = document.querySelector('.hero-bg-image-v2.active');
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
            setScrolled(scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Clock Logic (Kept for Hero Section)
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const parts = formatter.formatToParts(now);
            const getPart = (type) => parts.find(p => p.type === type).value;
            const dateStr = `${getPart('month')}/${getPart('day')}/${getPart('year')}`;
            const timeStr = `${getPart('hour')}:${getPart('minute')}${getPart('dayPeriod').toLowerCase()}`;
            setSeoulTime(`${dateStr} ${timeStr} SEOUL`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
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
            {/* Streetwear Header V2 */}
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
                    <div className="seoul-clock-v2">
                        {seoulTime}
                    </div>
                    <h1 className="hero-title-main-v2 glitch-text" data-text="SPECTER">SPECTER</h1>
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
                            <span>@</span>
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

            {/* Honor Roll Section */}
            <section className="reviews-section-v2">
                <h2 className="section-title-v2 reveal-on-scroll">수강생 후기</h2>
                <div className="reviews-marquee-container-v2">
                    <div className="reviews-track-v2">
                        {/* Original Reviews */}
                        {reviews.map((review) => (
                            <div key={`original-${review.id}`} className="review-card-v2">
                                <div className="review-header-v2">
                                    <div>
                                        <h3 className="review-name-v2">{review.name}</h3>
                                        <p className="review-course-v2">{review.course}</p>
                                    </div>
                                    <div className="review-rating-v2">
                                        {'★'.repeat(review.rating)}
                                    </div>
                                </div>
                                <p className="review-comment-v2">{review.comment}</p>
                                <span className="review-date-v2">{review.date}</span>
                            </div>
                        ))}
                        {/* Duplicated Reviews for Infinite Scroll */}
                        {reviews.map((review) => (
                            <div key={`duplicate-${review.id}`} className="review-card-v2">
                                <div className="review-header-v2">
                                    <div>
                                        <h3 className="review-name-v2">{review.name}</h3>
                                        <p className="review-course-v2">{review.course}</p>
                                    </div>
                                    <div className="review-rating-v2">
                                        {'★'.repeat(review.rating)}
                                    </div>
                                </div>
                                <p className="review-comment-v2">{review.comment}</p>
                                <span className="review-date-v2">{review.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="section-divider-v2"></div>

            {/* Notices Section */}
            <section className="notices-section-v2" style={{ padding: '50px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h2 className="section-title-v2 reveal-on-scroll">공지사항</h2>
                {recentNotices.length > 0 ? (
                    <ul className="notices-list-v2">
                        {recentNotices.map((notice, index) => (
                            <li key={notice.id} className="notice-item-v2 reveal-on-scroll" style={{ transitionDelay: `${index * 0.1}s` }}>
                                <Link to="/notices" className="notice-link-v2">
                                    <span className="notice-title-text-v2">{notice.title}</span>
                                    <span className="notice-date-v2">{notice.createdAt}</span>
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
