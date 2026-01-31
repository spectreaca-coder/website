import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HomePageV2.css';
import logo from '../assets/logo.png';
import AdminLoginModal from './AdminLoginModal';

const HeaderV2 = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // 로고 탭 카운터
    const tapCountRef = useRef(0);
    const tapTimeoutRef = useRef(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // 로고 클릭 핸들러 (3탭 감지)
    const handleLogoClick = (e) => {
        e.preventDefault();

        tapCountRef.current += 1;

        // 기존 타임아웃 클리어
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }

        // 1초 내에 3번 탭하면 처리
        if (tapCountRef.current >= 3) {
            tapCountRef.current = 0;

            if (isAdmin) {
                // 로그아웃
                sessionStorage.removeItem('isAdmin');
                setIsAdmin(false);
                alert('관리자 모드가 해제되었습니다.');
                navigate('/'); // Refresh or stay
            } else {
                // 로그인 모달 표시
                setShowAdminModal(true);
            }
        } else {
            // 1초/0.5초 후 카운터 리셋
            tapTimeoutRef.current = setTimeout(() => {
                // 1탭이면 홈으로 이동 (Reload 방지)
                if (tapCountRef.current === 1) {
                    if (location.pathname !== '/') {
                        navigate('/');
                    }
                }
                tapCountRef.current = 0;
            }, 500);
        }
    };

    const handleAdminLogin = () => {
        setIsAdmin(true);
        alert('관리자 모드가 활성화되었습니다.');
    };

    // 세션 스토리지에서 관리자 상태 확인
    useEffect(() => {
        const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminFlag);
    }, []);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to check active link
    const isActive = (path) => location.pathname === path;
    const isHomePage = location.pathname === '/';

    return (
        <>
            <header className={`sw-header-v2 ${scrolled ? 'scrolled' : ''} ${!isHomePage ? 'not-home' : ''}`}>
                {/* Mobile Menu Button (Hamburger) */}
                <button className="mobile-menu-btn-v2" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="header-logo-container-v2">
                    <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="Spectre Academy" />
                        {isAdmin && <span className="admin-badge">ADMIN</span>}
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="sw-nav-v2">
                    <Link to="/instructors" className="sw-nav-link-v2" style={isActive('/instructors') ? { color: 'var(--sw-primary)' } : {}}>강사진</Link>
                    <Link to="/curriculum" className="sw-nav-link-v2" style={isActive('/curriculum') ? { color: 'var(--sw-primary)' } : {}}>수업소개</Link>
                    <Link to="/notices" className="sw-nav-link-v2" style={isActive('/notices') ? { color: 'var(--sw-primary)' } : {}}>공지사항</Link>
                    <Link to="/register" className="sw-nav-link-v2" style={{ color: 'var(--sw-primary)' }}>수강신청</Link>
                </nav>

                {/* Mobile Nav Overlay */}
                <div className={`mobile-nav-overlay-v2 ${isMobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/instructors" className="mobile-nav-link-v2" onClick={toggleMobileMenu}>강사진</Link>
                    <Link to="/curriculum" className="mobile-nav-link-v2" onClick={toggleMobileMenu}>수업소개</Link>
                    <Link to="/notices" className="mobile-nav-link-v2" onClick={toggleMobileMenu}>공지사항</Link>
                    <Link to="/register" className="mobile-nav-link-v2" style={{ color: 'var(--sw-primary)' }} onClick={toggleMobileMenu}>수강신청</Link>
                </div>
            </header>

            {/* Admin Login Modal */}
            {showAdminModal && (
                <AdminLoginModal
                    onClose={() => setShowAdminModal(false)}
                    onLogin={handleAdminLogin}
                />
            )}
        </>
    );
};

export default HeaderV2;
