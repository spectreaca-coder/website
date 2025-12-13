import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePageV3.css'; // Reuse header/ticker styles
import logo from '../assets/logo.png';

const LocationV3 = () => {
    const mapRef = React.useRef(null);

    useEffect(() => {
        const container = document.getElementById('v3-map');

        const initMap = () => {
            if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
                window.kakao.maps.load(() => {
                    if (container && !mapRef.current) {
                        const options = {
                            center: new window.kakao.maps.LatLng(37.49759, 127.0586),
                            level: 3,
                        };
                        const map = new window.kakao.maps.Map(container, options);
                        mapRef.current = map;

                        const markerPosition = new window.kakao.maps.LatLng(37.49759, 127.0586);
                        const marker = new window.kakao.maps.Marker({
                            position: markerPosition,
                        });
                        marker.setMap(map);

                        // Add zoom control
                        const zoomControl = new window.kakao.maps.ZoomControl();
                        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                        // Initial relayout
                        setTimeout(() => {
                            map.relayout();
                            map.setCenter(markerPosition);
                        }, 100);
                    }
                });
            } else {
                setTimeout(initMap, 100);
            }
        };

        initMap();

        const handleWindowResize = () => {
            if (mapRef.current) {
                mapRef.current.relayout();
                mapRef.current.setCenter(new window.kakao.maps.LatLng(37.49759, 127.0586));
            }
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return (
        <div className="v3-container">
            {/* 1. LIVE TICKER */}
            <div className="v3-ticker-wrap">
                <div className="v3-ticker">
                    <div className="v3-ticker-item">스펙터 아카데미 2025학년도 수강생 모집</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">대치동의 중심에서 시작되는 변화</div>
                    <div className="v3-ticker-item">●</div>
                    <div className="v3-ticker-item">방문 상담 예약 필수</div>
                </div>
            </div>

            {/* 2. V3 HEADER */}
            <header className="v3-header">
                <div className="v3-logo">
                    <Link to="/v3">
                        <img src={logo} alt="Specter Academy" />
                    </Link>
                </div>
                <nav className="v3-nav">
                    <Link to="/v3/instructors" className="v3-nav-link">강사진</Link>
                    <Link to="/v3/curriculum" className="v3-nav-link">커리큘럼</Link>
                    <Link to="/v3/notices" className="v3-nav-link">공지사항</Link>
                    <Link to="/v3/location" className="v3-nav-link active">오시는 길</Link>
                    <Link to="/v3/register" className="v3-nav-link" style={{ color: 'var(--v3-lime)' }}>입학 신청</Link>
                </nav>
            </header>

            {/* 3. CONTENT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', minHeight: 'calc(100vh - 100px)' }}>
                {/* Info Panel */}
                <div style={{ padding: '4rem', borderRight: '1px solid var(--v3-white)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 className="v3-page-title" style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '3rem' }}>
                        Campus <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--v3-lime)' }}>Map</span>
                    </h1>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontFamily: 'Inter', fontSize: '1.2rem', color: 'var(--v3-lime)', marginBottom: '0.5rem' }}>ADDRESS</h3>
                        <p style={{ fontSize: '1.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>서울 강남구 삼성로57길 39</p>
                        <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.5rem' }}>39, Samseong-ro 57-gil, Gangnam-gu, Seoul</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontFamily: 'Inter', fontSize: '1.2rem', color: 'var(--v3-lime)', marginBottom: '0.5rem' }}>CONTACT</h3>
                        <p style={{ fontSize: '1.5rem', fontFamily: 'Pretendard', fontWeight: 'bold' }}>02-1234-5678</p>
                        <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.5rem' }}>info@specteracademy.com</p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <a href="https://map.kakao.com/link/to/스펙터학원,37.49759,127.0586" target="_blank" rel="noopener noreferrer" className="v3-reveal-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            카카오맵 크게 보기 →
                        </a>
                    </div>
                </div>

                {/* Map Panel */}
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div id="v3-map" style={{ width: '100%', height: '100%' }}></div>
                    {/* Overlay for style (optional) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', boxShadow: 'inset 0 0 100px rgba(20, 36, 138, 0.5)' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LocationV3;
