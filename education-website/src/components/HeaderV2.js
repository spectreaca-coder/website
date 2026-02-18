import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HomePageV2.css';
import logo from '../assets/logo.png';
import AdminLoginModal from './AdminLoginModal';
import useToast from '../hooks/useToast';

const HeaderV2 = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { toast, showToast } = useToast();

    // 로고 탭 카운터
    const tapCountRef = useRef(0);
    const tapTimeoutRef = useRef(null);

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true);
        document.body.style.overflow = 'hidden'; // scroll lock
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = ''; // scroll unlock
    };

    const toggleMobileMenu = () => {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    // ESC 키로 모바일 메뉴 닫기
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);

    // 컴포넌트 언마운트 시 scroll lock 해제
    useEffect(() => {
        return () => { document.body.style.overflow = ''; };
    }, []);

    // 로고 클릭 핸들러 (3탭 감지)
    const handleLogoClick = (e) => {
        e.preventDefault();
        tapCountRef.current += 1;

        if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);

        if (tapCountRef.current >= 3) {
            tapCountRef.current = 0;
            if (isAdmin) {
                sessionStorage.removeItem('isAdmin');
                setIsAdmin(false);
                showToast('관리자 모드가 해제되었습니다.', 'info');
                navigate('/');
            } else {
                setShowAdminModal(true);
            }
        } else {
            tapTimeoutRef.current = setTimeout(() => {
                if (tapCountRef.current === 1) {
                    if (location.pathname !== '/') navigate('/');
                }
                tapCountRef.current = 0;
            }, 500);
        }
    };

    const handleAdminLogin = () => {
        setIsAdmin(true);
        showToast('관리자 모드가 활성화되었습니다.', 'success');
    };

    // 세션 스토리지에서 관리자 상태 확인
    useEffect(() => {
        const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminFlag);
    }, []);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;
    const isHomePage = location.pathname === '/';

    return (
        <>
            {toast}
            <header className={`sw-header-v2 ${scrolled ? 'scrolled' : ''} ${!isHomePage ? 'not-home' : ''}`}>
                {/* Mobile Menu Button (Hamburger) */}
                <button
                    className={`mobile-menu-btn-v2 ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                    aria-expanded={isMobileMenuOpen}
                >
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
                {/* Backdrop - click to close */}
                <div
                    className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
                <div className={`mobile-nav-overlay-v2 ${isMobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
                    {/* 닫기 버튼 */}
                    <button
                        className="mobile-nav-close-btn"
                        onClick={closeMobileMenu}
                        aria-label="메뉴 닫기"
                    >
                        ✕
                    </button>
                    <Link to="/instructors" className="mobile-nav-link-v2" onClick={closeMobileMenu}>강사진</Link>
                    <Link to="/curriculum" className="mobile-nav-link-v2" onClick={closeMobileMenu}>수업소개</Link>
                    <Link to="/notices" className="mobile-nav-link-v2" onClick={closeMobileMenu}>공지사항</Link>
                    <Link to="/register" className="mobile-nav-link-v2" style={{ color: 'var(--sw-primary)' }} onClick={closeMobileMenu}>수강신청</Link>
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
