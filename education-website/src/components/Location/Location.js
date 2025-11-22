import React, { useEffect } from 'react';
import './Location.css';

const Location = () => {
  const mapRef = React.useRef(null);

  useEffect(() => {
    const container = document.getElementById('map');

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

            // Initial relayout to ensure correct rendering
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
    <div className="location-page-container">
      <div className="info-panel">
        <h1>오시는 길</h1>
        <div className="info-item">
          <span className="info-label">학원명</span>
          <span className="info-data">스펙터 학원</span>
        </div>
        <div className="info-item">
          <span className="info-label">주소</span>
          <span className="info-data">서울 강남구 삼성로57길 39</span>
        </div>
        {/* Add more info items as needed */}
      </div>
      <div className="map-panel">
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default Location;
