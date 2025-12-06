import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import ThreadsPost from './ThreadsPost';
import heroBg from '../assets/streetwear-hero.png';
import logo from '../assets/logo.png';

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
    } catch (e) {
      console.warn('Session storage access failed:', e);
    }

    // Load recent notices
    try {
      const savedInquiries = localStorage.getItem('inquiries');
      if (savedInquiries) {
        const inquiries = JSON.parse(savedInquiries);
        setRecentNotices(inquiries.slice(0, 5));
      }
    } catch (e) {
      console.warn('Local storage access failed:', e);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: '박성재',
      course: '서울대 의예과',
      rating: 5,
      comment: '신쌤 수업을 들으면서 제가 가장 크게 느낀 점은 학습 효율성이 높다는 것이었어요! 철저한 오답풀이 중심의 수업 구성 덕분에 시간을 낭비하지 않고 제게 필요한 영어 학습에 집중하여 공부할 수 있었습니다.',
      date: '2024.03.15'
    },
    {
      id: 2,
      name: '허영준',
      course: '서울대 화공생명학과',
      rating: 5,
      comment: '신쌤께 배운 이후에는 신쌤의 초강력 내신대비 덕분에 계속 1등급을 받을 수 있었어요. 특히 신쌤의 예상문제는 진짜 대박입니다.',
      date: '2024.02.28'
    },
    {
      id: 3,
      name: '김유은',
      course: '연세대 사학과',
      rating: 5,
      comment: '신쌤 수업을 유독 강조하는 이유는 열정 이에요! 새벽이 되어도 저희 질문을 친절하게 받아주시기 때문에 내신 공부하는데에 큰 도움이 되었어요.',
      date: '2024.01.10'
    },
    {
      id: 4,
      name: '황이주',
      course: '연세대 경영학과',
      rating: 5,
      comment: '첫 수업 들어보시면 알겠지만 신쌤은 사랑입니다! 타이트하게 수업 진행 하면서도 웃음과 유머를 겸비하셨기 때문에 몸은 힘들어도 저는 언제나 신쌤 수업 들으러 학원 가는게 기쁘고 행복했던 것 같습니다.',
      date: '2023.12.05'
    }
  ];

  return (
    <div className="homepage-container">
      {/* Streetwear Header */}
      <header className="sw-header">
        {/* Mobile Menu Button (Hamburger) */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="header-logo-container">
          <Link to="/">
            <img src={logo} alt="Specter Academy" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="sw-nav">
          <Link to="/instructors" className="sw-nav-link">Instructors</Link>
          <Link to="/my-classes" className="sw-nav-link">Curriculum</Link>
          <Link to="/register" className="sw-nav-link" style={{ color: 'var(--sw-primary)' }}>Admissions</Link>
        </nav>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/instructors" className="mobile-nav-link" onClick={toggleMobileMenu}>Instructors</Link>
          <Link to="/my-classes" className="mobile-nav-link" onClick={toggleMobileMenu}>Curriculum</Link>
          <Link to="/register" className="mobile-nav-link" style={{ color: 'var(--sw-primary)' }} onClick={toggleMobileMenu}>Admissions</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroBg} alt="Specter Academy Hero" className="hero-bg-image" />
        <div className="hero-overlay">
          <h1 className="hero-title-main">SPECTER</h1>
          <div className="hero-buttons">
            <Link to="/register" className="sw-button primary">Admissions</Link>
            <Link to="/my-classes" className="sw-button secondary">Curriculum</Link>
          </div>
        </div>
      </section>

      {/* Threads Section - News Ticker Style */}
      <section className="threads-section">
        <div className="threads-container">
          <div className="threads-header-bar">
            <span>Director's Note</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="threads-embed-wrapper">
            <ThreadsPost isAdmin={isAdmin} />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">HONOR ROLL</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <h3 className="review-name">{review.name}</h3>
                  <p className="review-course">{review.course}</p>
                </div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <span className="review-date">{review.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Notices Section */}
      <section className="notices-section">
        <h2 className="section-title">NOTICE BOARD</h2>
        {recentNotices.length > 0 ? (
          <ul className="notices-list">
            {recentNotices.map((notice) => (
              <li key={notice.id} className="notice-item">
                <Link to="/notices" className="notice-link">
                  <span className="notice-title-text">{notice.title}</span>
                  <span className="notice-date">{notice.createdAt}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', fontFamily: 'Courier New' }}>No recent notices.</p>
        )}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Link to="/notices" style={{ fontWeight: 'bold', textDecoration: 'underline', fontFamily: 'Helvetica Neue' }}>VIEW ALL →</Link>
        </div>
      </section>

      {/* Floating KakaoTalk Button */}
      <a
        href="https://open.kakao.com/o/sovpYkzc"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-kakao-btn"
        aria-label="KakaoTalk"
      >
        <span className="kakao-icon">💬</span>
      </a>
    </div>
  );
};

export default HomePage;
