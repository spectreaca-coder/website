import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV3.css'; // Reuse header/ticker styles
import logo from '../assets/logo.png';

const CurriculumV3 = () => {
    // Data ported from CurriculumV2
    const curriculumData = [
        { week: 'WEEK 01', title: '오리엔테이션 & 기초 다지기', details: ['스펙터 아카데미 학습 시스템 소개', '학습 환경 설정 및 멘토링', '과목별 기초 개념 점검'] },
        { week: 'WEEK 02', title: '논리적 사고의 기초', details: ['명제 논리와 진리표', '논리적 동치와 함의', '비판적 사고 훈련'] },
        { week: 'WEEK 03', title: '심화 미적분학', details: ['극한과 연속성의 엄밀한 정의', '미분법의 응용과 최적화', '적분과 넓이/부피 계산'] },
        { week: 'WEEK 04', title: '비판적 독해와 분석', details: ['고난도 텍스트 구조 분석', '저자의 의도 파악 및 논증 평가', '수사학적 전략 이해'] },
        { week: 'WEEK 05', title: '중간 점검 및 프로젝트', details: ['개인별 약점 분석 및 피드백', '심화 탐구 프로젝트 제안서 제출', '중간 평가 모의고사'] },
        { week: 'WEEK 06', title: '물리 심화 탐구', details: ['역학적 에너지 보존 법칙', '열역학 제1, 2법칙의 이해', '전자기장과 맥스웰 방정식 기초'] },
        { week: 'WEEK 07', title: '실전 모의고사 & 파이널', details: ['수능/내신 대비 실전 모의고사', '오답 노트 및 1:1 클리닉', '최종 점검 및 마인드 컨트롤'] },
        { week: 'WEEK 08', title: '최종 평가 및 수료', details: ['종합 평가 시험', '탐구 프로젝트 발표회', '수료식 및 진학 상담'] },
    ];

    const [activeWeek, setActiveWeek] = useState(null);

    const toggleWeek = (index) => {
        setActiveWeek(activeWeek === index ? null : index);
    };

    return (
        <div className="v3-container">
            {/* 1. LIVE TICKER */}
            <div className="v3-ticker-wrap">
                <div className="v3-ticker">
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">체계적인 학습 관리 시스템</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">성적 향상의 확실한 로드맵</div>
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
                    <Link to="/v3/instructors" className="v3-nav-link">강사진</Link>
                    <Link to="/v3/curriculum" className="v3-nav-link">커리큘럼</Link>
                    <Link to="/v3/notices" className="v3-nav-link">공지사항</Link>
                    <Link to="/v3/location" className="v3-nav-link">오시는 길</Link>
                    <Link to="/v3/register" className="v3-nav-link" style={{ color: 'var(--v3-lime)' }}>입학 신청</Link>
                </nav>
            </header>

            {/* 3. CONTENT */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h1 className="v3-page-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>
                    Academic <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--v3-lime)' }}>Roadmap</span>
                </h1>

                <div className="v3-curriculum-list">
                    {curriculumData.map((item, index) => (
                        <div
                            key={index}
                            className="v3-curriculum-item"
                            onClick={() => toggleWeek(index)}
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '2rem 0',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}>
                                    <span style={{ fontFamily: 'Courier New', color: 'var(--v3-lime)', fontSize: '1.2rem' }}>{item.week}</span>
                                    <h2 style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'Inter', fontWeight: '800', textTransform: 'uppercase' }}>{item.title}</h2>
                                </div>
                                <span style={{ fontSize: '2rem', color: 'var(--v3-lime)', transform: activeWeek === index ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>+</span>
                            </div>

                            {activeWeek === index && (
                                <div style={{ padding: '2rem 0 0 8rem', animation: 'fadeIn 0.5s' }}>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {item.details.map((detail, i) => (
                                            <li key={i} style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'Pretendard', fontStyle: 'normal' }}>
                                                → {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurriculumV3;
