import React, { useState, useEffect } from 'react';
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

  const embedUrl = getEmbedUrl(youtubeUrl);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
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
      {/* Foreground YouTube Video */}
      {embedUrl ? (
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
              <button onClick={() => setIsEditModalVisible(true)} className="edit-video-btn">수정</button>
            </div>
          )}
        </div>
      ) : (
        <div className="video-placeholder">
          <p>유효하지 않은 유튜브 URL입니다.</p>
        </div>
      )}

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
