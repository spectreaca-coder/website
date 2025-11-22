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

  // Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Mock Threads Data (Replace with actual data fetching later)
  const latestThread = {
    id: 1,
    author: '신원장',
    handle: 'director_shin',
    avatar: 'https://ui-avatars.com/api/?name=Shin&background=000&color=fff',
    content: '오늘도 학생들의 열정에 감동받는 하루입니다. 🌟\n\n성적 향상은 단순히 지식을 쌓는 것이 아니라, \n자신의 한계를 뛰어넘는 과정이라는 것을 \n우리 학생들이 증명해내고 있네요.\n\n이번 주말 특강도 화이팅입니다! 🔥',
    timestamp: '2시간 전',
    likes: 124,
    replies: 12
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-orb"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <div className="title-with-icons">
              <span className="hero-title-main">스펙터 학원</span>
              <div className="social-icons">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="social-icon threads" aria-label="Threads">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.28 0 2.47-.4 3.46-1.09.66.67 1.58 1.09 2.54 1.09 2.21 0 4-1.79 4-4s-1.79-4-4-4c-1.86 0-3.43 1.28-3.87 3.02-.08.31-.13.63-.13.98 0 2.21 1.79 4 4 4 .92 0 1.77-.31 2.46-.84.4.57.64 1.26.64 2.01 0 1.59-1.06 2.94-2.52 3.35C17.23 16.88 14.76 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.36 0 2.61.45 3.61 1.21L14.5 8.3C13.77 7.8 12.91 7.5 12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5c1.04 0 2-.35 2.77-.94-.3-.43-.48-.95-.48-1.51 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.14-.78 2.1-1.84 2.39-.86.23-1.77.36-2.71.36-2.76 0-5-2.24-5-5s2.24-5 5-5c1.15 0 2.22.39 3.08 1.05l1.1-1.1C15.19 6.74 13.67 6 12 6z" />
                  </svg>
                </a>
              </div>
            </div>
            <span className="hero-title-sub">최고가 최고를 만듭니다</span>
          </h1>
          <p className="hero-description">
            체계적인 커리큘럼과 최고의 강사진이 함께하는<br />
            당신의 목표 달성을 위한 최고의 선택
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="cta-button primary">수강신청</Link>
            <Link to="/my-classes" className="cta-button secondary">강좌소개</Link>
          </div>
        </div>
      </section>

      {/* Threads Section - Today's Director Shin */}
      <section className="threads-section">
        <h2 className="section-title">오늘의 신원장</h2>
        <div className="threads-card">
          <div className="threads-header">
            <div className="threads-profile">
              <div className="threads-avatar">
                <img src={latestThread.avatar} alt={latestThread.author} />
              </div>
              <div className="threads-info">
                <span className="threads-author">{latestThread.author}</span>
                <span className="threads-handle">@{latestThread.handle}</span>
              </div>
            </div>
            <div className="threads-meta">
              <span className="threads-time">{latestThread.timestamp}</span>
              <span className="threads-more">•••</span>
            </div>
          </div>
          <div className="threads-content">
            <p>{latestThread.content}</p>
          </div>
          <div className="threads-actions">
            <button className="threads-action-btn">
              <svg aria-label="좋아요" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
            </button>
            <button className="threads-action-btn">
              <svg aria-label="답글" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </button>
            <button className="threads-action-btn">
              <svg aria-label="리포스트" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"></path></svg>
            </button>
            <button className="threads-action-btn">
              <svg aria-label="공유" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">수강생 후기</h2>
        <div className="reviews-carousel-container">
          <div
            className="reviews-track"
            style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="review-slide">
                <div className="review-card">
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
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentReviewIndex ? 'active' : ''}`}
                onClick={() => setCurrentReviewIndex(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
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
