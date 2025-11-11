import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const [loginClickCount, setLoginClickCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdmin') === 'true');

  // Update login status on route change
  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
  }, [location]);

  // Reset click count after a delay
  useEffect(() => {
    if (loginClickCount > 0) {
      const timer = setTimeout(() => setLoginClickCount(0), 1000); // Reset after 1 second
      return () => clearTimeout(timer);
    }
  }, [loginClickCount]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSecretLoginClick = () => {
    const newClickCount = loginClickCount + 1;
    setLoginClickCount(newClickCount);

    if (newClickCount === 3) {
      setLoginClickCount(0);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''} ${isHomePage ? 'home-header' : ''}`}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="스펙터 아카데미 로고" />
        </Link>
      </div>
      <nav className="main-nav">
        <ul>
          <li><Link to="/instructors">강사진</Link></li>
          <li><Link to="/my-classes">강좌소개</Link></li>
          <li><Link to="/register">수강신청</Link></li>
          <li><Link to="/notices">공지/문의</Link></li>
          <li><Link to="/location">오시는 길</Link></li>
        </ul>
      </nav>
      <div className="user-auth">
        {isAdmin ? (
          <button type="button" onClick={handleLogout} className="logout-button">로그아웃</button>
        ) : (
          <div className="secret-login-trigger" onClick={handleSecretLoginClick}></div>
        )}
      </div>
    </header>
  );
};

export default Header;