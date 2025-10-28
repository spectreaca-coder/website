import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const showNav = () => {
    setIsNavVisible(true);
  };

  const hideNav = () => {
    setIsNavVisible(false);
  };

  return (
    <div
      className="header-container"
      onMouseEnter={showNav}
      onMouseLeave={hideNav}
    >
      <header className={`header ${isNavVisible ? 'visible' : ''}`}>
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/specter-intro">스펙터 소개</Link></li>
            <li><Link to="/instructors">강사진 소개</Link></li>
            <li><Link to="/location">위치</Link></li>
            <li><Link to="/contact">문의</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
