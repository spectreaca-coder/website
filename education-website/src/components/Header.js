import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const [loginClickCount, setLoginClickCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdmin') === 'true');

  // Update login status on route change
  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
    // Close mobile menu on route change
    setMobileMenuOpen(false);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className={`app-header ${scrolled ? 'scrolled' : ''} ${isHomePage ? 'home-header' : ''}`}>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="스펙터 아카데미 로고" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
          <ul>
            <li><Link to="/instructors">강사진</Link></li>
            <li><Link to="/my-classes">강좌소개</Link></li>
            <li><Link to="/register">수강신청</Link></li>
            <li><Link to="/notices">공지</Link></li>
            <li><Link to="/location">오시는 길</Link></li>
          </ul>
        </nav>

        <div className="header-right">
          <div className="user-auth">
            {isAdmin ? (
              <button type="button" onClick={handleLogout} className="logout-button">로그아웃</button>
            ) : (
              <div className="secret-login-trigger" onClick={handleSecretLoginClick}></div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="메뉴"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Slide Menu */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
      <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/instructors">강사진</Link></li>
          <li><Link to="/my-classes">강좌소개</Link></li>
          <li><Link to="/register">수강신청</Link></li>
          <li><Link to="/notices">공지</Link></li>
          <li><Link to="/location">오시는 길</Link></li>
          {isAdmin && (
            <li className="mobile-logout">
              <button type="button" onClick={handleLogout}>로그아웃</button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;