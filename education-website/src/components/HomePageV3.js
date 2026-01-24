import React from 'react';
import { Link } from 'react-router-dom';
import './HomePageV3.css';
import logo from '../assets/logo.png';
import ThreadsPost from './ThreadsPost'; // Import ThreadsPost // Assuming logo exists here

const HomePageV3 = () => {
    return (
        <div className="homepage-v3-container">
            {/* 1. LIVE TICKER (Fixed Top) */}
            <div className="v3-ticker-wrap">
                <div className="v3-ticker">
                    <div className="v3-ticker-item">SPECTER ACADEMY 2025 ADMISSIONS OPEN</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">대치동 최고의 입시 전문가 그룹</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">최상위권 도약을 위한 완벽한 커리큘럼</div>
                    {/* Duplicate for seamless loop */}
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">대치동 최고의 입시 전문가 그룹</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">최상위권 도약을 위한 완벽한 커리큘럼</div>
                </div>
            </div>

            {/* 2. V3 HEADER (Sticky below Ticker) */}
            <header className="v3-header">
                <div className="v3-logo">
                    <Link to="/v3">
                        <img src={logo} alt="Specter Academy" />
                    </Link>
                </div>
                <nav className="v3-nav">
                    <Link to="/v3/instructors" className="v3-nav-link">강사진</Link>
                    <Link to="/v3/curriculum" className="v3-nav-link">커리큘럼</Link>
                    <Link to="/v3/notices" className="v3-nav-link">공지사항</Link>
                    <Link to="/v3/location" className="v3-nav-link">오시는 길</Link>
                    <Link to="/v3/register" className="v3-nav-link" style={{ color: 'var(--v3-lime)' }}>입학 신청</Link>
                </nav>
            </header>

            {/* 3. HERO SECTION */}
            <div className="v3-hero-grid">
                <div className="v3-hero-text">
                    <h1 className="v3-hero-title">
                        압도적인<br />
                        <span className="serif">성적 상승의</span><br />
                        시작.
                    </h1>
                    <p className="v3-hero-sub">
                        스펙터 아카데미는 단순한 지식 전달을 넘어,<br />
                        학생 스스로 생각하고 문제를 해결하는 힘을 기릅니다.<br />
                        대치동 1%를 위한 프리미엄 교육을 경험하세요.
                    </p>
                    <div style={{ marginTop: '3rem' }}>
                        <Link to="/v3/register" className="v3-reveal-btn" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>
                            상담 예약하기 →
                        </Link>
                    </div>
                </div>
                <div className="v3-hero-visual">
                    <div className="v3-shape"></div>
                    {/* Placeholder for a cool image or 3D element */}
                </div>
            </div>

            {/* 4. INTERACTIVE CURRICULUM GRID */}
            <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--v3-navy)' }}>
                <div className="v3-section-title">SYSTEM</div>
                <div className="v3-grid-menu">
                    <div className="v3-grid-item">
                        <span className="num">01</span>
                        <h3>수학<br />Mathematics</h3>
                        <div className="v3-reveal-content">
                            <h3>수학 (Mathematics)</h3>
                            <p>논리적 사고와 문제 해결 능력 배양.<br />기초부터 심화까지 완벽한 로드맵.</p>
                            <Link to="/v3/curriculum" className="v3-reveal-btn">자세히 보기</Link>
                        </div>
                    </div>
                    <div className="v3-grid-item">
                        <span className="num">02</span>
                        <h3>영어<br />English</h3>
                        <div className="v3-reveal-content">
                            <h3>영어 (English)</h3>
                            <p>글로벌 리더를 위한 실전 영어.<br />독해, 문법, 회화의 균형 잡힌 학습.</p>
                            <Link to="/v3/curriculum" className="v3-reveal-btn">자세히 보기</Link>
                        </div>
                    </div>
                    <div className="v3-grid-item">
                        <span className="num">03</span>
                        <h3>과학<br />Science</h3>
                        <div className="v3-reveal-content">
                            <h3>과학 (Science)</h3>
                            <p>탐구력과 창의력을 키우는 실험 중심 교육.<br />물리, 화학, 생명과학 심화 과정.</p>
                            <Link to="/v3/curriculum" className="v3-reveal-btn">자세히 보기</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. THREADS SECTION (Director's Note) */}
            <div className="v3-section-padding" style={{ backgroundColor: 'var(--v3-white)', color: 'var(--v3-navy)' }}>
                <div className="v3-section-title" style={{ color: 'rgba(20, 36, 138, 0.1)' }}>INSIGHTS</div>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', fontFamily: 'Inter', fontWeight: '800' }}>
                        원장 <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--v3-navy)' }}>인사말</span>
                    </h2>
                    <div style={{ border: '1px solid var(--v3-navy)', padding: '20px', backgroundColor: '#f8f9fa' }}>
                        <ThreadsPost isAdmin={false} variant="v3" />
                    </div>
                </div>
            </div>

            {/* 6. REVIEWS SECTION (Honor Roll) */}
            <div className="v3-section-padding" style={{ backgroundColor: 'var(--v3-navy)' }}>
                <div className="v3-section-title">HONOR ROLL</div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {[
                        { name: '박성재', course: '서울대 의예과 합격', comment: '스펙터는 단순히 정답을 알려주는 것이 아니라, 생각하는 힘을 길러주었습니다.' },
                        { name: '허영준', course: '서울대 화공생명 합격', comment: '내신 대비부터 수능까지, 선생님들의 철저한 관리 덕분에 흔들리지 않았습니다.' },
                        { name: '김유은', course: '연세대 사학과 합격', comment: '열정과 논리가 공존하는 수업. 제 인생 최고의 학습 경험이었습니다.' }
                    ].map((review, i) => (
                        <div key={i} style={{ border: '1px solid var(--v3-white)', padding: '1.5rem', transition: 'transform 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontFamily: 'Pretendard', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--v3-lime)' }}>{review.name}</h3>
                                <div style={{ color: 'var(--v3-lime)', fontSize: '0.8rem' }}>★★★★★</div>
                            </div>
                            <p style={{ fontFamily: 'Pretendard', fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.5rem' }}>{review.course}</p>
                            <p style={{ fontFamily: 'Pretendard', lineHeight: '1.5', fontSize: '0.95rem' }}>"{review.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. FLOATING KAKAO BUTTON */}
            <a
                href="https://open.kakao.com/o/sovpYkzc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#FEE500',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    zIndex: 2000,
                    textDecoration: 'none'
                }}
            >
                💬
            </a>
        </div>
    );
};

export default HomePageV3;
