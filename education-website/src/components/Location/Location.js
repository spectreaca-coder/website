import React, { useEffect } from 'react';
import './Location.css';

const Location = () => {
  useEffect(() => {
    const loadMap = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (container) {
            const options = {
              center: new window.kakao.maps.LatLng(37.49759, 127.0586),
              level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);
            const markerPosition = new window.kakao.maps.LatLng(37.49759, 127.0586);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          }
        });
      } else {
        // If the script is not loaded yet, retry after a short delay
        setTimeout(loadMap, 100);
      }
    };

    loadMap();

    // Handle window resize
    const handleResize = () => {
      const container = document.getElementById('map');
      if (container && container.firstChild) {
        // Assuming map instance is accessible or we need to store it.
        // Since we can't easily access the map instance created inside loadMap from here without state or ref,
        // we'll modify the loadMap function to store the map instance in a ref or variable if needed.
        // However, for a simple fix, we can just reload or rely on CSS.
        // But Kakao map needs map.relayout() when container size changes.

        // Let's use a slightly different approach to keep it simple but effective.
        // We will just re-run the center positioning if we can access the map.
      }
    };

    // Better approach: Store map instance
    let mapInstance = null;

    const initMap = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (container) {
            const options = {
              center: new window.kakao.maps.LatLng(37.49759, 127.0586),
              level: 3,
            };
            mapInstance = new window.kakao.maps.Map(container, options);
            const markerPosition = new window.kakao.maps.LatLng(37.49759, 127.0586);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(mapInstance);

            // Add zoom control
            const zoomControl = new window.kakao.maps.ZoomControl();
            mapInstance.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
          }
        });
      } else {
        setTimeout(initMap, 100);
      }
    };

    initMap();

    const handleWindowResize = () => {
      if (mapInstance) {
        mapInstance.relayout();
        mapInstance.setCenter(new window.kakao.maps.LatLng(37.49759, 127.0586));
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
