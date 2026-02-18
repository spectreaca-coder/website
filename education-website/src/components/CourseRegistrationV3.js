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

    const sendToGoogleSheets = async (applicationData) => {
        const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
        console.log('🔗 [Debug V3] Current Script URL:', GOOGLE_SCRIPT_URL);

        if (!GOOGLE_SCRIPT_URL) {
            console.error('❌ [Debug V3] Google Script URL is missing!');
            return;
        }

        try {
            const formData = new URLSearchParams();
            for (const key in applicationData) {
                formData.append(key, applicationData[key]);
            }

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            console.log('✅ [Debug V3] Google Sheets 전송 시도 완료');
        } catch (error) {
            console.error('❌ [Debug V3] Google Sheets 전송 실패:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const applicationData = {
            studentName: formData.name,
            studentGrade: 'V3 입학신청',
            studentPhone: formData.phone,
            parentPhone: 'N/A (V3)',
            courseTitle: formData.course,
            courseTeacher: 'V3 인스트럭터',
            courseDay: 'N/A',
            courseTime: 'N/A',
            status: 'confirmed',
            courseId: 'v3_' + formData.course
        };

        try {
            await sendToGoogleSheets(applicationData);
            alert(`Application Submitted for ${formData.name}!\n곧 연락드리겠습니다.`);
        } catch (err) {
            alert('전송 중 에러가 발생했습니다.');
        }
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
