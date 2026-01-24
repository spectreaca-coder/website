import React from 'react';
import { Link } from 'react-router-dom';
import './HomePageV3.css'; // Reuse header/ticker styles
import './InstructorsV3.css';
import logo from '../assets/logo.png';

const InstructorsV3 = () => {
    const instructors = [
        { id: 1, name: '신원장', subject: '영어 / 입시 컨설팅', bio: '대치동 15년 경력. 서울대, 연세대, 고려대 다수 합격생 배출. 학생의 잠재력을 끌어내는 독보적인 강의력.' },
        { id: 2, name: '김수학', subject: '수학 (미적분/기하)', bio: 'KAIST 수리과학과 졸업. 복잡한 개념을 직관적으로 설명하는 명쾌한 강의. 수능 수학 만점자 다수 배출.' },
        { id: 3, name: '이과학', subject: '물리 / 화학', bio: '서울대 물리교육과 졸업. 원리를 꿰뚫는 심층적인 설명. 내신부터 수능까지 완벽 대비.' },
        { id: 4, name: '박국어', subject: '국어 (문학/비문학)', bio: '고려대 국어국문학과 졸업. 지문 분석의 새로운 패러다임 제시. 논리적 독해력 향상 전문가.' },
        { id: 5, name: '최논술', subject: '인문 논술', bio: '연세대 철학과 졸업. 대학별 출제 경향 완벽 분석. 합격을 부르는 답안 작성법 지도.' },
    ];

    return (
        <div className="v3-container">
            {/* 1. LIVE TICKER */}
            <div className="v3-ticker-wrap">
                <div className="v3-ticker">
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">최고의 강사진과 함께하는 성공적인 입시</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">지금 바로 상담 신청하세요</div>
                </div>
            </div>

            {/* 2. V3 HEADER */}
            <header className="v3-header">
                <div className="v3-logo">
                    <Link to="/v3">
                        <img src={logo} alt="Specter Academy" />
                    </Link>
                </div>
                <nav className="v3-nav">
                    <Link to="/v3/instructors" className="v3-nav-link active">강사진</Link>
                    <Link to="/v3/curriculum" className="v3-nav-link">커리큘럼</Link>
                    <Link to="/v3/notices" className="v3-nav-link">공지사항</Link>
                    <Link to="/v3/location" className="v3-nav-link">오시는 길</Link>
                    <Link to="/v3/register" className="v3-nav-link" style={{ color: 'var(--v3-lime)' }}>입학 신청</Link>
                </nav>
            </header>

            {/* 3. CONTENT */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h1 className="v3-page-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>
                    Our <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--v3-lime)' }}>Instructors</span>
                </h1>

                <div className="v3-instructors-grid">
                    {instructors.map(inst => (
                        <div key={inst.id} className="v3-instructor-card">
                            <div className="v3-instructor-photo">
                                {inst.name}
                            </div>
                            <div>
                                <h2 className="v3-instructor-name">{inst.name}</h2>
                                <div className="v3-instructor-subject">{inst.subject}</div>
                                <p className="v3-instructor-bio">{inst.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstructorsV3;
