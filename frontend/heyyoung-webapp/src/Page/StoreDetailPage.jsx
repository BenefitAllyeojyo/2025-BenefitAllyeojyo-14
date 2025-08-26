import React, { useState, useEffect } from 'react';
import StoreDetailCard from '../Components/molecules/TextGrp/StoreDetailCard';
import styles from './StoreDetailPage.module.css';
import BackgroundBottomTabImage from '@/Components/atoms/BackgroundBottomTabImage/BackgroundBottomTabImage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StoreDetailPage() {
  const [storeDetail, setStoreDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // URL 쿼리 파라미터에서 storeId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const idFromQuery = urlParams.get('id');
    
    // 세션스토리지에서 storeId 가져오기
    const idFromSession = sessionStorage.getItem('selectedStoreId');
    
    const finalStoreId = idFromQuery || idFromSession;
    
    if (finalStoreId) {
      setStoreId(finalStoreId);
      fetchStoreDetail(finalStoreId);
    } else {
      console.log('storeId를 찾을 수 없습니다');
      setLoading(false);
    }
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (storeDetail && storeDetail.partnershipBranchDto) {
      console.log('지도 초기화 시작');
      console.log('storeDetail:', storeDetail);
      console.log('partnershipBranchDto:', storeDetail.partnershipBranchDto);
      
      // 약간의 지연을 두고 지도 초기화 (DOM이 완전히 렌더링된 후)
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [storeDetail]);

  const initializeMap = () => {
    if (window.kakao && window.kakao.maps) {
      // 기본값으로 서울 위도경도 사용
      let latitude = 37.480662634299556;
      let longitude = 126.95227152324334;
      
      // API 응답이 있으면 실제 위도경도 사용
      if (storeDetail && storeDetail.partnershipBranchDto) {
        // API 응답에서 위도경도 가져오기 (순서 주의!)
        const apiLat = parseFloat(storeDetail.partnershipBranchDto.latitude);  // 위도
        const apiLng = parseFloat(storeDetail.partnershipBranchDto.longitude); // 경도
        
        if (!isNaN(apiLat) && !isNaN(apiLng)) {
          // 위도경도 순서가 반대로 되어 있으므로 교체
          latitude = apiLng;  // API의 latitude를 실제 위도로 사용
          longitude = apiLat; // API의 longitude를 실제 경도로 사용
          console.log('API 응답에서 가져온 위도경도 (순서 교체됨):', { 
            originalLat: apiLat, 
            originalLng: apiLng,
            correctedLat: latitude, 
            correctedLng: longitude 
          });
        } else {
          console.log('API 위도경도가 유효하지 않아 기본값 사용:', { 
            apiLat, 
            apiLng, 
            defaultLat: latitude, 
            defaultLng: longitude 
          });
        }
      } else {
        console.log('API 응답이 없어 기본 위도경도 사용:', { latitude, longitude });
      }

      const container = document.getElementById('storeMap');
      if (!container) {
        console.error('지도 컨테이너를 찾을 수 없습니다');
        return;
      }

      console.log('지도 컨테이너 찾음:', container);

      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3
      };

      console.log('지도 옵션:', options);

      const map = new window.kakao.maps.Map(container, options);
      console.log('지도 객체 생성됨:', map);

      // 커스텀 SVG 마커 이미지로 생성 (보라색)
      const customIcon = new window.kakao.maps.MarkerImage(
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

      // 마커 추가 (커스텀 아이콘 사용)
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: customIcon
      });

      marker.setMap(map);
      setMapLoaded(true);
      console.log('지도 초기화 완료 - 커스텀 마커 사용');
    } else {
      console.error('Kakao Maps API가 로드되지 않았습니다');
      // Kakao Maps API가 로드되지 않았을 때 재시도
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          initializeMap();
        }
      }, 1000);
    }
  };

  const fetchStoreDetail = async (id) => {
    try {
      console.log('Store ID:', id);

      // API 호출
      const response = await fetch(`${API_BASE_URL}/partnerships/${id}`, {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      setStoreDetail(data.result);
      setLoading(false);
    } catch (error) {
      console.error('API 호출 실패:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!storeId) {
    return (
      <div className={styles.container}>
        <div className={styles.noDataMessage}>
          <h1>정보가 없어요!</h1>
          <p>가게 정보를 찾을 수 없습니다.</p>
          <p>상세보기 버튼을 통해 접근해주세요.</p>
        </div>
        <BackgroundBottomTabImage currentTab="benefit" position="absolute" />
      </div>
    );
  }

  return (
    <div className={styles.container}>      
      {storeDetail ? (
        <>
          {/* 지도 섹션 */}
          <div className={styles.mapSection}>
            <div id="storeMap" className={styles.mapContainer}>
              {!mapLoaded && <div className={styles.loading}>지도 로딩 중...</div>}
            </div>
          </div>

          {/* 가게 정보 카드 */}
          <StoreDetailCard storeDetail={storeDetail} />
        </>
      ) : (
        <div className={styles.noDataMessage}>
          <h1>정보가 없어요!</h1>
          <p>가게 정보를 찾을 수 없습니다.</p>
        </div>
      )}
      
      <BackgroundBottomTabImage currentTab="benefit" position="absolute" />
    </div>
  );
}
