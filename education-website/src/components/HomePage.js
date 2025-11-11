import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Modal from './Modal';

const defaultYoutubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const getEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    let videoId = urlObj.hostname === 'youtu.be' ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v');
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  } catch (error) {
    return null;
  }
};

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(() => localStorage.getItem('youtubeUrl') || defaultYoutubeUrl);
  const [urlInput, setUrlInput] = useState(youtubeUrl);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);

  const embedUrl = getEmbedUrl(youtubeUrl);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');

    // Load recent notices
    const savedInquiries = localStorage.getItem('inquiries');
    if (savedInquiries) {
      const inquiries = JSON.parse(savedInquiries);
      setRecentNotices(inquiries.slice(0, 3));
    }
  }, []);

  const handleUrlSave = (e) => {
    e.preventDefault();
    localStorage.setItem('youtubeUrl', urlInput);
    setYoutubeUrl(urlInput);
    setIsEditModalVisible(false);
    alert('영상이 변경되었습니다.');
  };

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

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">왜 스펙터 아카데미인가?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>체계적인 커리큘럼</h3>
            <p>학생 개개인의 수준에 맞춘 맞춤형 학습 계획</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>최고의 강사진</h3>
            <p>풍부한 경험과 노하우를 갖춘 전문 강사진</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>높은 합격률</h3>
            <p>검증된 교육 방식으로 목표 달성 보장</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>1:1 맞춤 관리</h3>
            <p>학생 한 명 한 명을 세심하게 케어하는 시스템</p>
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

      {/* YouTube Video Section */}
      {embedUrl && (
        <section className="video-section">
          <h2 className="section-title">스펙터 아카데미 소개</h2>
          <div className="video-wrapper">
            <div className="video-container">
              <iframe
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {isAdmin && (
              <div className="edit-video-btn-container">
                <button onClick={() => setIsEditModalVisible(true)} className="edit-video-btn">영상 수정</button>
              </div>
            )}
          </div>
        </section>
      )}

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

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <h2>지금 바로 시작하세요</h2>
        <p>당신의 목표를 향한 첫 걸음, 스펙터 아카데미와 함께하세요</p>
        <Link to="/register" className="cta-button large">수강신청 하러가기</Link>
      </section>

      {/* Admin Modal */}
      {isEditModalVisible && (
        <Modal onClose={() => setIsEditModalVisible(false)}>
          <form className="admin-video-form" onSubmit={handleUrlSave}>
            <h2>메인 유튜브 영상 URL 수정</h2>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button type="submit">저장</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
