import React from 'react';
import MapView from '../Components/molecules/MapGrp/MapView';
import BackgroundBottomTabImage from '@/Components/atoms/BackgroundBottomTabImage/BackgroundBottomTabImage';

const MapTestPage = () => {
  // 테스트용 마커 데이터
  const testMarkers = [
    {
      lat: 37.5665,
      lng: 126.978,
      title: '서울시청',
      description: '서울특별시 중구 세종대로 110',
      benefit: '공무원 할인 20%',
    },
    {
      lat: 37.5668,
      lng: 126.9788,
      title: '광화문',
      description: '서울특별시 종로구 세종로',
      benefit: '문화재 할인 30%',
    },
  ];

  const handleMarkerClick = (markerData, index) => {
    console.log(`마커 ${index + 1} 클릭됨:`, markerData);
  };

  return (
    <div>
    <MapView />
      <BackgroundBottomTabImage 
        currentTab="benefit"
      />
    </div>
  );
};

export default MapTestPage;
