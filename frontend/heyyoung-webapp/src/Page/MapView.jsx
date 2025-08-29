import React from 'react';
import MapView from '../Components/molecules/MapGrp/MapView';
import { stores, convertStoresToMarkers } from '../mocks/stores';
import styles from './MapView.module.css';
import BackgroundBottomTabImage from '@/Components/atoms/BackgroundBottomTabImage/BackgroundBottomTabImage';

const MapViewTestPage = () => {
  // 스토어 데이터를 마커 형식으로 변환
  const storeMarkers = convertStoresToMarkers(stores);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* 지도만 표시 - 너비 제한을 위한 컨테이너 */}

      <MapView markers={storeMarkers} />

      {/* <BackgroundBottomTabImage currentTab="benefit" position="absolute" /> */}
    </div>
  );
};

export default MapViewTestPage;
