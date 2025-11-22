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

  // Threads Data State
  const [latestThread, setLatestThread] = useState({
    id: 1,
    author: '신원장',
    handle: 'daechi_spectre',
    avatar: 'https://ui-avatars.com/api/?name=Shin&background=000&color=fff',
    content: '불러오는 중...',
    timestamp: '',
    likes: null,
    replies: null
  });

  useEffect(() => {
    const CACHE_KEY = 'threads_latest_post';
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

    const fetchLatestThread = async () => {
      try {
        // 1. Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        let hasValidCache = false;

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const now = new Date().getTime();

          // If cache is valid (within duration), use it immediately
          if (now - timestamp < CACHE_DURATION) {
            setLatestThread(data);
            hasValidCache = true;
            console.log('Using cached Threads data');
          } else {
            // Even if expired, show it first while fetching new data (stale-while-revalidate)
            setLatestThread(data);
            console.log('Using expired cached Threads data while fetching new');
          }
        }

        // If we have valid cache, we can skip fetching or fetch in background
        // Here we fetch in background to keep it fresh if it's expired or close to expiring

        // Using RSSHub to get Threads feed (via allorigins proxy to avoid CORS)
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://rsshub.app/threads/@daechi_spectre'));
        const data = await response.json();

        if (data.contents) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.contents, "text/xml");
          const items = xmlDoc.querySelectorAll("item");

          if (items.length > 0) {
            // Find the most recent post by date (skip pinned posts if any)
            let latestItem = null;
            let latestDate = null;

            // Check all items and find the one with the most recent date
            Array.from(items).forEach(item => {
              const pubDateText = item.querySelector("pubDate")?.textContent || "";
              if (pubDateText) {
                const itemDate = new Date(pubDateText);
                if (!latestDate || itemDate > latestDate) {
                  latestDate = itemDate;
                  latestItem = item;
                }
              }
            });

            // Use the latest item or fallback to first item
            const targetItem = latestItem || items[0];
            const description = targetItem.querySelector("description")?.textContent || "";
            const contentEncoded = targetItem.querySelector("content\\:encoded, encoded")?.textContent || "";
            const pubDate = targetItem.querySelector("pubDate")?.textContent || "";

            // Use content:encoded if available (usually longer), otherwise use description
            const rawContent = contentEncoded.length > description.length ? contentEncoded : description;

            // Clean up content (remove HTML tags if any)
            const cleanContent = rawContent
              .replace(/<[^>]*>/gm, '')  // Remove HTML tags
              .replace(/&nbsp;/g, ' ')    // Replace &nbsp; with space
              .replace(/&amp;/g, '&')     // Replace &amp; with &
              .replace(/&lt;/g, '<')      // Replace &lt; with <
              .replace(/&gt;/g, '>')      // Replace &gt; with >
              .replace(/&quot;/g, '"')    // Replace &quot; with "
              .trim();

            // Debug: log the content length and date
            console.log('Fetched Threads content length:', cleanContent.length);
            console.log('Content preview:', cleanContent.substring(0, 200) + '...');
            console.log('Post date:', pubDate);

            // Format timestamp - more accurate calculation
            const date = new Date(pubDate);
            const now = new Date();
            const diffTime = now - date;
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let timeString;
            if (diffMinutes < 60) {
              timeString = diffMinutes <= 1 ? '방금 전' : `${diffMinutes}분 전`;
            } else if (diffHours < 24) {
              timeString = `${diffHours}시간 전`;
            } else if (diffDays < 7) {
              timeString = `${diffDays}일 전`;
            } else {
              // Show actual date if older than a week
              timeString = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            }

            const newThreadData = {
              id: 1,
              author: '신원장',
              handle: 'daechi_spectre',
              avatar: 'https://ui-avatars.com/api/?name=Shin&background=000&color=fff',
              content: cleanContent,
              timestamp: timeString,
              likes: null,
              replies: null
            };

            setLatestThread(newThreadData);

            // Update cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              data: newThreadData,
              timestamp: new Date().getTime()
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch Threads:", error);
        // Fallback to cached data if available (even if expired), otherwise static fallback
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          setLatestThread(data);
          console.log('Using cached data due to fetch error');
        } else {
          setLatestThread(prev => ({
            ...prev,
            content: '안녕하세요. 학부모님\n"미리 준비하는 고등내신"\n스펙터 Pre-High 겨울 특강 설명회 안내드립니다.\n\n참석을 원하시는 분께서는\n하단 신청서 제출 부탁드립니다.\n(선착순 마감)\n\n후순위, 타 일정으로 인해\n참석이 어려운 분들께는\n영상 촬영본 발송 예정입니다.\n(신청서 작성자 한정)',
            timestamp: '1일 전',
            likes: null,
            replies: null
          }));
        }
      }
    };

    fetchLatestThread();
  }, []);

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-orb"></div>

        {/* Social Sidebar */}
        <div className="hero-social-sidebar">
          <a href="https://www.youtube.com/@daechi_maru" target="_blank" rel="noopener noreferrer" className="sidebar-icon youtube" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <div className="sidebar-line"></div>
          <a href="https://www.threads.com/@daechi_spectre?hl=ko" target="_blank" rel="noopener noreferrer" className="sidebar-icon threads" aria-label="Threads">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.28 0 2.47-.4 3.46-1.09.66.67 1.58 1.09 2.54 1.09 2.21 0 4-1.79 4-4s-1.79-4-4-4c-1.86 0-3.43 1.28-3.87 3.02-.08.31-.13.63-.13.98 0 2.21 1.79 4 4 4 .92 0 1.77-.31 2.46-.84.4.57.64 1.26.64 2.01 0 1.59-1.06 2.94-2.52 3.35C17.23 16.88 14.76 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.36 0 2.61.45 3.61 1.21L14.5 8.3C13.77 7.8 12.91 7.5 12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5c1.04 0 2-.35 2.77-.94-.3-.43-.48-.95-.48-1.51 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.14-.78 2.1-1.84 2.39-.86.23-1.77.36-2.71.36-2.76 0-5-2.24-5-5s2.24-5 5-5c1.15 0 2.22.39 3.08 1.05l1.1-1.1C15.19 6.74 13.67 6 12 6z" />
            </svg>
          </a>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">스펙터 학원</span>
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
        <div className="threads-container">
          <div className="threads-badge">
            <span className="pulse-dot"></span>
            오늘의 신원장
          </div>
          <div className="threads-card emphasized">
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
              <div className="threads-logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.28 0 2.47-.4 3.46-1.09.66.67 1.58 1.09 2.54 1.09 2.21 0 4-1.79 4-4s-1.79-4-4-4c-1.86 0-3.43 1.28-3.87 3.02-.08.31-.13.63-.13.98 0 2.21 1.79 4 4 4 .92 0 1.77-.31 2.46-.84.4.57.64 1.26.64 2.01 0 1.59-1.06 2.94-2.52 3.35C17.23 16.88 14.76 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.36 0 2.61.45 3.61 1.21L14.5 8.3C13.77 7.8 12.91 7.5 12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5c1.04 0 2-.35 2.77-.94-.3-.43-.48-.95-.48-1.51 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.14-.78 2.1-1.84 2.39-.86.23-1.77.36-2.71.36-2.76 0-5-2.24-5-5s2.24-5 5-5c1.15 0 2.22.39 3.08 1.05l1.1-1.1C15.19 6.74 13.67 6 12 6z" />
                </svg>
              </div>
            </div>
            <div className="threads-content">
              <p>{latestThread.content}</p>
            </div>
            <div className="threads-footer-info">
              <span className="threads-time">{latestThread.timestamp}</span>
              {latestThread.likes !== null && latestThread.replies !== null && (
                <span className="threads-stats">{latestThread.likes} 좋아요 · {latestThread.replies} 답글</span>
              )}
            </div>
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
