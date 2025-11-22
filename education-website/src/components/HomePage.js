import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);
  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');

    // Load recent notices
    const savedInquiries = localStorage.getItem('inquiries');
    if (savedInquiries) {
      const inquiries = JSON.parse(savedInquiries);
      setRecentNotices(inquiries.slice(0, 3));
    }
  }, []);

  // Sample reviews data from uploaded image
  const reviews = [
    {
      id: 1,
      name: '박성재',
      course: '서울대 의예과',
      rating: 5,
      comment: '신쌤 수업을 들으면서 제가 가장 크게 느낀 점은 학습 효율성이 높다는 것이었어요! 철저한 오답풀이 중심의 수업 구성 덕분에 시간을 낭비하지 않고 제게 필요한 영어 학습에 집중하여 공부할 수 있었습니다.',
      date: '효율적 수업'
    },
    {
      id: 2,
      name: '허영준',
      course: '서울대 화공생명학과',
      rating: 5,
      comment: '신쌤께 배운 이후에는 신쌤의 초강력 내신대비 덕분에 계속 1등급을 받을 수 있었어요. 특히 신쌤의 예상문제는 진짜 대박입니다. 공부할 때 진짜 이대로 나오나 하다가 시험지 보고 똑같이 나와서 깜놀 한 적이 한 두번이 아니었죠.ㅎㅎ',
      date: '놀라운 적중력'
    },
    {
      id: 3,
      name: '김유은',
      course: '연세대 사학과',
      rating: 5,
      comment: '신쌤 수업을 유독 강조하는 이유는 열정 이에요! 새벽이 되어도 저희 질문을 친절하게 받아주시기 때문에 내신 공부하는데에 큰 도움이 되었어요. 시험 전날 밤까지 모르는 게 생기면 답답해서 미치는데 신쌤이 저희와 함께 깨어있으시기 때문에 다음날 시험을 상쾌하게 볼 수 있었어요.',
      date: '열정적 강의'
    },
    {
      id: 4,
      name: '황이주',
      course: '연세대 경영학과',
      rating: 5,
      comment: '첫 수업 들어보시면 알겠지만 신쌤은 사랑입니다! 타이트하게 수업 진행 하면서도 웃음과 유머를 겸비하셨기 때문에 몸은 힘들어도 저는 언제나 신쌤 수업 들으러 학원 가는게 기쁘고 행복했던 것 같습니다.ㅎㅎ 한번 들으면 못 빠져나올걸요?! 제가 장담합니다.ㅋㅋ',
      date: '유쾌한 강의'
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
              <div className="review-footer">
                <span className="review-tag">{review.date}</span>
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
        href="https://open.kakao.com/o/sovpYkzc"
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
