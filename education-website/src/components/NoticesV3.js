import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV3.css'; // Reuse header/ticker styles
import logo from '../assets/logo.png';

const NoticesV3 = () => {
    // Data ported from NoticesV2
    const notices = [
        { id: 1, title: '2025학년도 봄학기 수강생 모집 안내', date: '2024.11.29', content: '2025학년도 봄학기 수강생 모집이 시작되었습니다. 입학 신청 페이지를 통해 접수해 주시기 바랍니다. 조기 마감될 수 있으니 서둘러 주세요.' },
        { id: 2, title: '12월 학원 시설 점검 및 휴관 안내', date: '2024.11.25', content: '쾌적한 학습 환경 조성을 위해 12월 1일(일) 시설 점검이 진행됩니다. 당일은 도서관 및 자습실 이용이 제한되오니 양해 부탁드립니다.' },
        { id: 3, title: '신규 수학 강사 초빙 (김수학 선생님)', date: '2024.11.20', content: 'KAIST 출신의 실력파 김수학 선생님이 스펙터 아카데미에 합류하셨습니다. 더욱 강력해진 수학 커리큘럼을 기대해 주세요.' },
        { id: 4, title: '장학생 선발 결과 발표', date: '2024.11.15', content: '2024년 하반기 장학생 선발 결과가 개별 통보되었습니다. 선발된 학생들에게는 장학 증서와 소정의 장학금이 수여됩니다.' },
    ];

    const [openNotice, setOpenNotice] = useState(null);

    const toggleNotice = (id) => {
        setOpenNotice(openNotice === id ? null : id);
    };

    return (
        <div className="v3-container">
            {/* 1. LIVE TICKER */}
            <div className="v3-ticker-wrap">
                <div className="v3-ticker">
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">최신 입시 정보와 학원 소식</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">중요 공지사항을 확인하세요</div>
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
                    <Link to="/v3/notices" className="v3-nav-link active">공지사항</Link>
                    <Link to="/v3/location" className="v3-nav-link">오시는 길</Link>
                    <Link to="/v3/register" className="v3-nav-link" style={{ color: 'var(--v3-lime)' }}>입학 신청</Link>
                </nav>
            </header>

            {/* 3. CONTENT */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h1 className="v3-page-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>
                    <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--v3-lime)' }}>공지사항</span>
                </h1>

                <div className="v3-notices-list">
                    {notices.map((notice) => (
                        <div
                            key={notice.id}
                            className="v3-notice-item"
                            onClick={() => toggleNotice(notice.id)}
                            style={{
                                border: '1px solid var(--v3-white)',
                                marginBottom: '1rem',
                                transition: 'all 0.3s',
                                backgroundColor: openNotice === notice.id ? 'var(--v3-white)' : 'transparent',
                                color: openNotice === notice.id ? 'var(--v3-navy)' : 'var(--v3-white)'
                            }}
                        >
                            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div>
                                    <span style={{ fontFamily: 'Courier New', fontSize: '0.9rem', opacity: 0.7 }}>{notice.date}</span>
                                    <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontFamily: 'Pretendard', fontWeight: '600' }}>{notice.title}</h3>
                                </div>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{openNotice === notice.id ? '-' : '+'}</span>
                            </div>

                            {openNotice === notice.id && (
                                <div style={{ padding: '0 2rem 2rem 2rem', borderTop: '1px dashed var(--v3-navy)' }}>
                                    <p style={{ marginTop: '1rem', lineHeight: '1.6', fontSize: '1.1rem', fontFamily: 'Pretendard' }}>{notice.content}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoticesV3;
