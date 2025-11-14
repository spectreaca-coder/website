import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');

    // Load recent notices
    const savedInquiries = localStorage.getItem('inquiries');
    if (savedInquiries) {
      const inquiries = JSON.parse(savedInquiries);
      setRecentNotices(inquiries.slice(0, 3));
    }
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: '김민지',
      course: '수학 집중반',
      rating: 5,
      comment: '선생님의 설명이 정말 이해하기 쉽고, 체계적인 커리큘럼 덕분에 성적이 많이 올랐습니다. 강력 추천합니다!',
      date: '2025.01.10'
    },
    {
      id: 2,
      name: '이준호',
      course: '영어 고급반',
      rating: 5,
      comment: '1:1 맞춤 관리가 정말 좋았어요. 약점을 파악해서 집중적으로 학습할 수 있었습니다.',
      date: '2025.01.08'
    },
    {
      id: 3,
      name: '박서연',
      course: '국어 심화반',
      rating: 5,
      comment: '분위기도 좋고 강사진들의 열정이 느껴집니다. 목표했던 대학에 합격했어요!',
      date: '2025.01.05'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: '수강신청은 어떻게 하나요?',
      answer: '상단 메뉴의 "수강신청" 페이지에서 원하시는 강좌를 선택하시고 신청하실 수 있습니다. 또는 전화 상담을 통해서도 신청 가능합니다.'
    },
    {
      question: '강의 시간은 어떻게 되나요?',
      answer: '강좌별로 다양한 시간대를 운영하고 있습니다. 평일반, 주말반, 저녁반 등 학생의 일정에 맞춰 선택하실 수 있습니다.'
    },
    {
      question: '환불 규정은 어떻게 되나요?',
      answer: '학원의 설립·운영 및 과외교습에 관한 법률에 따라 환불 규정을 준수하고 있습니다. 자세한 내용은 전화 문의 부탁드립니다.'
    },
    {
      question: '체험 수업이 가능한가요?',
      answer: '네, 가능합니다. 첫 수업은 무료 체험으로 진행되며, 강사진과의 상담을 통해 수준에 맞는 반을 배정받으실 수 있습니다.'
    },
    {
      question: '주차 시설이 있나요?',
      answer: '건물 내 주차장을 이용하실 수 있으며, 인근 공영 주차장도 이용 가능합니다.'
    }
  ];

  // Gallery images
  const galleryImages = [
    { id: 1, title: '최신 시설', description: '쾌적한 학습 환경' },
    { id: 2, title: '수업 현장', description: '집중된 학습 분위기' },
    { id: 3, title: '합격 축하', description: '목표 달성의 기쁨' },
    { id: 4, title: '특강 현장', description: '전문가 초청 특강' }
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">스펙터 아카데미</span>
            <span className="hero-title-sub">최고가 최고를 만듭니다</span>
          </h1>
          <p className="hero-description">
            체계적인 커리큘럼과 최고의 강사진이 함께하는<br />
            당신의 목표 달성을 위한 최고의 선택
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="cta-button primary">수강신청</Link>
            <Link to="/my-classes" className="cta-button secondary">강좌보기</Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">95%</div>
            <div className="stat-label">목표 달성률</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">누적 수강생</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15년</div>
            <div className="stat-label">교육 경력</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">만족도</div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">수강생 후기</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-info">
                  <h3 className="review-name">{review.name}</h3>
                  <p className="review-course">{review.course}</p>
                </div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment">"{review.comment}"</p>
              <p className="review-date">{review.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">자주 묻는 질문</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                <span className="faq-icon">{expandedFaq === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Notices Section */}
      {recentNotices.length > 0 && (
        <section className="notices-section">
          <div className="section-header">
            <h2 className="section-title">최근 공지사항</h2>
            <Link to="/notices" className="view-all-link">전체보기 →</Link>
          </div>
          <div className="notices-grid">
            {recentNotices.map((notice) => (
              <Link to="/notices" key={notice.id} className="notice-card">
                <div className="notice-title">{notice.title}</div>
                <div className="notice-meta">
                  <span>{notice.author}</span>
                  <span>{notice.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Floating KakaoTalk Button */}
      <a
        href="https://pf.kakao.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-kakao-btn"
        aria-label="카카오톡 상담"
      >
        <span className="kakao-icon">💬</span>
      </a>
    </div>
  );
};

export default HomePage;
