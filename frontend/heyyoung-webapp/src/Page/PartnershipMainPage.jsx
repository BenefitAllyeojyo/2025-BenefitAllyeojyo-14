import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BellButton from '../Components/atoms/Button/BellButton'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import { SavingBox } from '../Components/molecules/TextGrp'
import BigCardBtn from '../Components/atoms/Button/BigCardBtn'
import { ZoneBox } from '../Components/molecules/CardGrp'
import logoImage from '../assets/images/logo.png'
import solGoImage from '../assets/images/character/SOL_GO.png'
import { fetchUserTotalSavings } from '../services/api'

// Mock Data
const mockSavingData = {
  leftText: "이번달 아낀 금액",
  rightText: "로딩 중..." // 초기값, 실제로는 API에서 가져옴
}

// Mock Data (더 이상 사용하지 않음, API 데이터로 대체)
// const mockPartnershipData = {
//   branchId: 1,
//   title: "설빙 강남점",
//   subtitle: "모든 메뉴 10% 할인",
//   distance: "현 위치에서 540m"
// }

export default function PartnershipMainPage() {
  const navigate = useNavigate()
  const [savingsData, setSavingsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [partnershipData, setPartnershipData] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log('사용자 위치:', position.coords);
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          // 기본 위치 (서울)
          setUserLocation({
            latitude: 37.5665,
            longitude: 126.9780
          });
        }
      );
    } else {
      console.log('Geolocation이 지원되지 않습니다');
      // 기본 위치 (서울)
      setUserLocation({
        latitude: 37.5665,
        longitude: 126.9780
      });
    }
  }, []);

  // 제휴처 데이터 로드
  useEffect(() => {
    const loadPartnershipData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/partnerships/1`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            setPartnershipData(data.result);
            console.log('제휴처 데이터 로드 성공:', data.result);
          }
        }
      } catch (error) {
        console.error('제휴처 데이터 로드 실패:', error);
      }
    };

    loadPartnershipData();
  }, []);

  // 저장 금액 데이터 로드
  useEffect(() => {
    const loadSavingsData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchUserTotalSavings()
        if (response.isSuccess) {
          setSavingsData(response.result)
        }
      } catch (error) {
        console.error('저장 금액 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavingsData()
  }, [])

  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // km
    return Math.round(distance * 1000); // m로 변환
  };

  // 제휴처와 사용자 간의 거리 계산
  const getPartnershipDistance = () => {
    if (!userLocation || !partnershipData?.partnershipBranchDto) {
      return "거리 정보 없음";
    }

    // API 응답에서 위도/경도 가져오기 (순서 주의!)
    const apiLat = parseFloat(partnershipData.partnershipBranchDto.latitude);  // 위도
    const apiLng = parseFloat(partnershipData.partnershipBranchDto.longitude); // 경도
    
    if (isNaN(apiLat) || isNaN(apiLng)) {
      return "거리 정보 없음";
    }

    // 위도/경도 순서가 반대로 되어 있을 수 있으므로 교체해서 시도
    let storeLat = apiLat;
    let storeLon = apiLng;
    
    // 첫 번째 시도: 원래 순서
    let distanceInMeters = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      storeLat,
      storeLon
    );

    // 만약 거리가 너무 크면 (1000km 이상) 위도/경도 순서를 교체해서 다시 시도
    if (distanceInMeters > 1000000) { // 1000km 이상
      console.log('거리가 너무 큽니다. 위도/경도 순서를 교체해서 다시 계산합니다.');
      console.log('원래 순서:', { apiLat, apiLng });
      console.log('교체된 순서:', { storeLat: apiLng, storeLon: apiLat });
      
      storeLat = apiLng;  // API의 latitude를 실제 위도로 사용
      storeLon = apiLat;  // API의 longitude를 실제 경도로 사용
      
      distanceInMeters = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        storeLat,
        storeLon
      );
      
      console.log('교체 후 거리:', distanceInMeters, 'm');
    }

    console.log('거리 계산 정보:', {
      userLocation: { lat: userLocation.latitude, lng: userLocation.longitude },
      storeLocation: { lat: storeLat, lng: storeLon },
      distance: distanceInMeters
    });

    // 1000m 이상이면 km로 표시, 미만이면 m로 표시
    if (distanceInMeters >= 1000) {
      const distanceInKm = (distanceInMeters / 1000).toFixed(1);
      return `현 위치에서 ${distanceInKm}km`;
    } else {
      return `현 위치에서 ${distanceInMeters}m`;
    }
  };

  const handleShopClick = () => {
    navigate('/partnership-list')
  }

  return (
    <div style={{ 
      position: 'relative', 
      height: '720px',
      backgroundColor: '#EFF0FC',
      overflow: 'hidden',
    }}>
      {/* 로고 - 상단 왼쪽에 배치 */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '9px',
          zIndex: 10
        }}
      >
        <img 
          src={logoImage} 
          alt="로고" 
          style={{ 
            height: '50px', 
            width: 'auto',
            display: 'block'
          }} 
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ 
        padding: '20px', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* 상단 알림 버튼 - 오른쪽 */}
        <div style={{
          alignSelf: 'flex-end',
          marginBottom: '20px'
        }}>
          <BellButton />
        </div>

        {/* SavingBox */}
        <SavingBox 
          leftText={mockSavingData.leftText}
          rightText={savingsData ? `${savingsData.totalSavedAmount.toLocaleString('ko-KR')}원` : isLoading ? '로딩 중...' : '0원'}
        />

        {/* ZoneBox들 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          marginTop: '20px'
        }}>
          <ZoneBox 
            image="shop"
            text="실시간 추천 제휴 보기"
            onClick={handleShopClick}
          />
          <ZoneBox 
            image="map"
            text="캠퍼스 제휴지도 보기"
            onClick={() => navigate('/benefit-map')}
          />
        </div>
      </div>

      {/* 하단 박스 */}
      <div style={{
        position: 'absolute',
        bottom: '66px', // 하단 탭 이미지 바로 위
        left: '0',
        width: '375px',
        height: '280px', // 222px에서 320px로 증가
        background: '#F3F6F9',
        padding: '60px 20px 20px 20px' // 위쪽 패딩을 60px로 늘림
      }}>
        {/* 실시간 추천 제휴처 제목 */}
        <div style={{
          color: 'var(--Neutral-Dark-Darkest, #1B1546)',
          fontFamily: 'OneShinhan',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 'normal',
          marginBottom: '16px'
        }}>
          실시간 추천 제휴처
        </div>

        {/* 제휴처 카드 */}
        <BigCardBtn
          title={partnershipData?.partnershipBranchDto?.name || "제휴처 정보 로딩 중..."}
          subtitle={partnershipData?.terms || "혜택 정보를 불러오는 중..."}
          distance={getPartnershipDistance()}
          onClick={async () => {
            try {
              console.log('제휴처 카드 클릭 - API 호출 시작');
              
              // 이미 로드된 데이터가 있으면 세션스토리지에 저장
              if (partnershipData) {
                sessionStorage.setItem('storeDetailData', JSON.stringify(partnershipData));
                console.log('Store detail data saved to sessionStorage');
                navigate('/store-detail');
                return;
              }

              // API 호출: /partnerships/{branchId}
              const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
              const response = await fetch(`${API_BASE_URL}/partnerships/1`, {
                method: 'GET',
                headers: {
                  accept: '*/*',
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              console.log('Partnership API Response:', data);

              // API 응답을 세션스토리지에 저장
              if (data.result) {
                sessionStorage.setItem('storeDetailData', JSON.stringify(data.result));
                console.log('Store detail data saved to sessionStorage');
              }

              // /store-detail로 이동
              navigate('/store-detail');
            } catch (error) {
              console.error('API 호출 실패:', error);
              // 에러 발생 시에도 /store-detail로 이동 (기본 데이터 사용)
              navigate('/store-detail');
            }
          }}
        />
      </div>

      {/* 하단 탭 이미지 */}
      {/* <BackgroundBottomTabImage 
        currentTab="benefit"
      /> */}

      {/* SOL_GO 이미지 - 하단에 배치 */}
      <div
        style={{
          position: 'absolute',
          bottom: '250px',
          right: '20px',
          zIndex: 10
        }}
      >
        <img 
          src={solGoImage} 
          alt="SOL_GO" 
          style={{ 
            height: '80px', 
            width: 'auto',
            display: 'block'
          }} 
        />
      </div>
    </div>
  )
}
