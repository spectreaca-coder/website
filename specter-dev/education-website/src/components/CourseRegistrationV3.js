import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV3.css'; // Reuse header/ticker styles
import logo from '../assets/logo.png';

const CourseRegistrationV3 = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: 'Mathematics',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Application Submitted for ${formData.name}!\n(This is a V3 Demo - Logic ported from V1)`);
        // In real implementation, this would call the same Firebase/API function as V1
    };

    const inputStyle = {
        width: '100%',
        padding: '1rem',
        backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        color: 'var(--v3-white)',
        fontFamily: 'Pretendard',
        fontSize: '1rem',
        marginBottom: '1.5rem',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    return (
        <div className="v3-container">
            {/* 1. LIVE TICKER */}
            <div className="v3-ticker-wrap">
                <div className="v3-ticker">
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">지금 바로 신청하세요</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">선착순 마감 임박</div>
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
                    <Link to="/v3/register" className="v3-nav-link active" style={{ color: 'var(--v3-lime)' }}>입학 신청</Link>
                </nav>
            </header>

            {/* 3. CONTENT */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h1 className="v3-page-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    Join the <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--v3-lime)' }}>Elite</span>
                </h1>
                <p style={{ textAlign: 'center', marginBottom: '4rem', opacity: 0.8, fontFamily: 'Pretendard' }}>
                    스펙터 아카데미와 함께 시작하세요. 아래 양식을 작성해 주시면 상담 전화를 드립니다.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '0.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>이름 (학생명)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="예: 홍길동"
                        required
                    />

                    <label style={{ marginBottom: '0.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="예: email@example.com"
                        required
                    />

                    <label style={{ marginBottom: '0.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>연락처</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="예: 010-1234-5678"
                        required
                    />

                    <label style={{ marginBottom: '0.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>관심 과목</label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="Mathematics" style={{ color: 'black' }}>수학 (Mathematics)</option>
                        <option value="English" style={{ color: 'black' }}>영어 (English)</option>
                        <option value="Science" style={{ color: 'black' }}>과학 (Science)</option>
                    </select>

                    <label style={{ marginBottom: '0.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>문의 사항 (선택)</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        style={{ ...inputStyle, height: '150px', resize: 'none' }}
                        placeholder="궁금하신 점이나 상담 희망 시간을 적어주세요."
                    />

                    <button
                        type="submit"
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--v3-lime)',
                            color: 'var(--v3-navy)',
                            border: 'none',
                            fontFamily: 'Pretendard',
                            fontWeight: '800',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        상담 신청하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseRegistrationV3;
