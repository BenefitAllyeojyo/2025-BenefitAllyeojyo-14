import React, { useState } from 'react';
import CharacterBtn from '../../atoms/Button/CharacterBtn';
import styles from './MapView.module.css';
import pliFaceImage from '../../../assets/images/character/PLI_Face.png';

const CharacterButtonGroup = ({ 
  showGptInput, 
  onChatbotClick, 
  onSchoolClick, 
  onLocationClick, 
  locationLoading, 
  locationError,
  currentLocation
}) => {
  const [showSatelliteButtons, setShowSatelliteButtons] = useState(false);

  // CharacterBtn 클릭 핸들러
  const handleCharacterClick = () => {
    setShowSatelliteButtons(!showSatelliteButtons);
  };

  return (
    <div className={`${styles.characterButtonContainer} ${showGptInput ? styles.withGptInput : ''}`}>
      {/* 위성 버튼들 */}
      {showSatelliteButtons && (
        <>
          {/* 챗봇 버튼 */}
          <button
            className={styles.satelliteButton}
            onClick={onChatbotClick}
            title="챗봇과 대화하기"
          >
            💬
          </button>
          
          {/* 학교 위치 버튼 */}
          <button
            className={styles.satelliteButton}
            onClick={onSchoolClick}
            title="학교 위치로 이동"
          >
            🏫
          </button>
          
          {/* 내 위치 버튼 */}
          <button
            className={styles.satelliteButton}
            onClick={onLocationClick}
            title={locationError || (currentLocation ? '내 위치로 이동' : '위치 정보 가져오기')}
            disabled={locationLoading}
          >
            {locationLoading ? '⏳' : locationError ? '❌' : (currentLocation ? '📍' : '❓')}
          </button>
        </>
      )}
      
      {/* 메인 CharacterBtn */}
      <CharacterBtn
        imageUrl={pliFaceImage}
        onClick={handleCharacterClick}
        alt="플리"
      />
    </div>
  );
};

export default CharacterButtonGroup;
