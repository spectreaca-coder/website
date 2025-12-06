import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV2.css';

import HeaderV2 from './HeaderV2';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import heroBg1 from '../assets/main-bg-v2.jpg';
import heroBg2 from '../assets/hero-bg-2.jpg';
import heroBg3 from '../assets/hero-bg-3.jpg';
import heroBg4 from '../assets/hero-bg-4.jpg';
import heroBg5 from '../assets/hero-bg-5.jpg';
import heroBg6 from '../assets/hero-bg-6.jpg';
import heroBg7 from '../assets/hero-bg-7.jpg';
import DirectorNoteV2 from './DirectorNoteV2';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const HomePageV2 = () => {
    const [heroImages] = useState([
        heroBg1, heroBg2, heroBg3, heroBg4, heroBg5, heroBg6, heroBg7
    ]);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [seoulTime, setSeoulTime] = useState('');
    const [recentNotices, setRecentNotices] = useState([]);

    // 후기 데이터 (스크린샷 기반)
    const reviews = [
        {
            id: 1,
            category: '효율적 수업',
            title: 'Q&A 방식 강의로 최대 효율을 추구',
            comment: '"신쌤 수업을 들으면서 제가 가장 크게 느낀 점은 학습 효율성이 높다 라는 것이었어요! 철저한 오답풀이 중심의 수업 구성 덕분에 시간을 낭비하지 않고 제게 필요한 영어 학습에 집중하여 공부할 수 있었습니다."',
            author: '서울대 의예과 박성재'
        },
        {
            id: 2,
            category: '놀라운 적중력',
            title: '기출 데이터에 근거한 학교별 예상문제',
            comment: '"신쌤께 배운 이후에는 신쌤의 초강력 내신대비 덕분에 계속 1등급을 받을 수 있었어요. 특히 신쌤의 예상문제는 진짜 대박입니다. 공부할 때는 진짜 이대로 나오나 하다가 시험지 보고 똑같이 나와서 깜놀 한 적이 한 두번이 아니었죠. ㅎㅎ"',
            author: '서울대 화공생명학과 허영준'
        },
        {
            id: 3,
            category: '열정적 강의',
            title: '학생들을 감동시키는 무한 열정 강의',
            comment: '"신쌤 수업을 유독 강조하는 이유는 열정 이에요! 새벽이 되어도 저희 질문을 친절하게 받아주시기 때문에 내신 공부하는데에 큰 도움이 되었어요. 시험 전날 밤까지 모르는 게 생기면 답답해서 미치는데 신쌤이 저희와 함께 깨어있으시기 때문에 다음날 시험을 상쾌하게 볼 수 있었어요."',
            author: '연세대 사학과 김유은'
        },
        {
            id: 4,
            category: '유쾌한 강의',
            title: '수업에 몰입할 수 밖에 없는 유쾌한 강의',
            comment: '"첫 수업 들어보시면 알겠지만 신쌤은 사랑입니다! 타이트하게 수업 진행 하면서도 웃음과 유머를 겸비하셨기 때문에 몸은 힘들어도 저는 언제나 신쌤 수업 들으러 학원 가는게 기쁘고 행복했던 것 같습니다. ㅎㅎ 한번 들으면 못 빠져나올걸요?! 제가 장담합니다. ㅋㅋ"',
            author: '연세대 경영학과 황이주'
        },
    ];

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

    // Parallax Effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroBg = document.querySelector('.hero-bg-image-v2.active');
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Clock Logic
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

            {/* 수강생 후기 Section */}
            <section className="reviews-section-v2">
                <h2 className="section-title-v2 reveal-on-scroll">수강생 후기</h2>
                <div className="reviews-grid-v2">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card-new-v2 reveal-on-scroll">
                            <div className="review-category-v2">{review.category}</div>
                            <h3 className="review-title-v2">{review.title}</h3>
                            <p className="review-comment-v2">{review.comment}</p>
                            <p className="review-author-v2">· {review.author} ·</p>
                        </div>
                    ))}
                </div>
            </section>

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
