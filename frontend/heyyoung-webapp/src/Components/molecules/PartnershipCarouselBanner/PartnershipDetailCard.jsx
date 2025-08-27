import React, { useEffect, useRef } from 'react';
import AboutTextModule from '../TextGrp/AboutTextModule';
import HostInfoModule from '../TextGrp/HostInfoModule';
import styles from './PartnershipCarouselBanner.module.css';

export default function PartnershipDetailCard({ 
  partnership,
  width = "300px",
  height = "275px"
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (window.kakao && window.kakao.maps) {
      // 강남역 좌표 (위도: 37.498095, 경도: 127.027610)
      const gangnamStationLat = 37.498095;
      const gangnamStationLng = 127.027610;
      
      const options = {
        center: new window.kakao.maps.LatLng(gangnamStationLat, gangnamStationLng),
        level: 3
      };

      mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);

      // 강남역에 커스텀 핀 마커 추가
      addCustomPinMarker(gangnamStationLat, gangnamStationLng, "강남역");
    }
  };

  const addCustomPinMarker = (lat, lng, title) => {
    if (!mapInstanceRef.current) return;

    // 기존에 사용했던 보라색 SVG 마커 생성
    const markerImage = new window.kakao.maps.MarkerImage(
      'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 18 25" fill="none">
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="#7C3AED"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <path d="M18 9.52335C18 13.6309 12.5156 20.9435 10.1109 23.9607C9.53438 24.6798 8.46562 24.6798 7.88906 23.9607C5.44219 20.9435 0 13.6309 0 9.52335C0 4.53983 4.02938 0.5 9 0.5C13.9688 0.5 18 4.53983 18 9.52335Z" fill="black" fill-opacity="0.2"/>
          <circle cx="9" cy="9.5" r="3" fill="white"/>
        </svg>
      `),
      new window.kakao.maps.Size(32, 40),
      { offset: new window.kakao.maps.Point(16, 40) }
    );

    // 마커 생성 및 추가
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
      map: mapInstanceRef.current,
      image: markerImage
    });

    // 마커 클릭 시 툴팁 표시
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:10px;text-align:center;min-width:150px;">
        <strong>${title}</strong><br/>
        서울특별시 강남구 강남대로 396
      </div>`
    });

    window.kakao.maps.event.addListener(marker, 'click', function() {
      infowindow.open(mapInstanceRef.current, marker);
    });
  };

  // 기본 제휴 정보 (partnership이 없을 때 사용)
  const defaultPartnership = {
    id: 1,
    shopName: "레드버튼 강북점",
    shopAddress: "서울특별시 강북구 한천로 139길 42",
    tag: "보드게임카페",
    terms: "학생증 및 교직원증 제시 시 식음료 메뉴 20% 할인\n- 8인 이상 단체 예약시 게임비 10% 추가 할인",
    hostName: "싸피대학교 총학생회"
  };

  const displayPartnership = partnership || defaultPartnership;

  return (
    <div 
      className={styles.detailCard}
      style={{ width, height }}
    >
      {/* ABOUT 섹션 */}
      <div className={styles.aboutSection}>
        <AboutTextModule
          title="ABOUT"
          content={displayPartnership.terms || "제휴 혜택 정보가 없습니다."}
        />
      </div>

      {/* 지도 섹션 */}
      <div className={styles.mapSection}>
        <div 
          ref={mapRef}
          className={styles.mapContainer}
        />
      </div>

      {/* 주최자 정보 섹션 */}
      <div className={styles.hostSection}>
        <HostInfoModule
          hostName={displayPartnership.hostName || "주최자 정보 없음"}
          hostIcon={import.meta.env.BASE_URL + "assets/images/character/PLI_Face.png"}
        />
      </div>
    </div>
  );
}
