import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ListItemBox.module.css';

const ListItemBox = ({ 
  position, 
  mapInstance, 
  onMarkerClick, 
  imagePath = '/src/assets/images/character/RINO_Face.png',
  imageSize = 60,
  circleRadius = 20,
  strokeColor = '#87CEEB',
  fillColor = '#FFFFFF',
  zIndex = 1000
}) => {
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const animationIntervalRef = useRef(null);

  useEffect(() => {
    if (!mapInstance || !position) return;

    // 기존 요소들 정리
    cleanup();

    // RINO_Face.png 이미지로 마커 생성 (패딩 포함하여 중앙 정렬)
    const markerImage = new kakao.maps.MarkerImage(
      imagePath,
      new kakao.maps.Size(imageSize, imageSize),
      {
        offset: new kakao.maps.Point(imageSize / 2, imageSize / 2),
        anchor: new kakao.maps.Point(imageSize / 2, imageSize / 2)
      }
    );

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(position.lat, position.lng),
      map: mapInstance,
      backgroundColor: 'white',
      image: markerImage,
      zIndex: zIndex
    });

    // 마커에 커서 스타일 적용 (클릭 가능함을 표시)
    // 카카오맵 마커의 DOM 요소에 직접 접근하여 CSS 클래스 적용
    setTimeout(() => {
      try {
        const markerElements = document.querySelectorAll('.kakao-maps-marker');
        const lastMarker = markerElements[markerElements.length - 1];
        if (lastMarker) {
          lastMarker.classList.add(styles.markerImage);
          lastMarker.title = '클릭하여 현재 위치로 이동';
          
          // 마커에 호버 효과 추가
          lastMarker.addEventListener('mouseenter', () => {
            lastMarker.classList.add(styles.markerImage);
          });
          
          lastMarker.addEventListener('mouseleave', () => {
            lastMarker.classList.remove(styles.markerImage);
          });
        }
      } catch (error) {
        console.log('마커 스타일 적용 실패:', error);
      }
    }, 100);

    // 리노 캐릭터 클릭 시 현재 위치로 지도 이동
    kakao.maps.event.addListener(marker, 'click', () => {
      console.log('리노 캐릭터 클릭됨 - 현재 위치로 이동');
      
      if (onMarkerClick) {
        onMarkerClick(position);
      }
      
      // 클릭 시 시각적 피드백 (CSS 애니메이션 + 원형 오버레이 강조)
      if (circleRef.current) {
        // 원형 오버레이 강조
        circleRef.current.setOptions({
          strokeWeight: 6,
          strokeColor: '#4A90E2',
          fillOpacity: 0.4
        });
        
        // 마커에 클릭 애니메이션 적용
        setTimeout(() => {
          try {
            const markerElements = document.querySelectorAll('.kakao-maps-marker');
            const lastMarker = markerElements[markerElements.length - 1];
            if (lastMarker) {
              lastMarker.classList.add(styles.clickedMarker);
              setTimeout(() => {
                lastMarker.classList.remove(styles.clickedMarker);
              }, 500);
            }
          } catch (error) {
            console.log('마커 클릭 애니메이션 적용 실패:', error);
          }
        }, 50);
        
        // 0.5초 후 원래 스타일로 복원
        setTimeout(() => {
          if (circleRef.current) {
            circleRef.current.setOptions({
              strokeWeight: 4,
              strokeColor: strokeColor,
              fillOpacity: 0.2
            });
          }
        }, 500);
      }
    });

    // 현재 위치 표시를 위한 원형 오버레이 생성
    const circleOverlay = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(position.lat, position.lng),
      radius: circleRadius,
      strokeWeight: 4,
      strokeColor: strokeColor,
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
      fillColor: fillColor,
      fillOpacity: 0.2,
      map: mapInstance,
      zIndex: 999
    });
    
    // 원형 오버레이에 CSS 클래스 적용 (애니메이션 효과)
    setTimeout(() => {
      try {
        const circleElements = document.querySelectorAll('.kakao-maps-circle');
        const lastCircle = circleElements[circleElements.length - 1];
        if (lastCircle) {
          lastCircle.classList.add(styles.locationCircle);
        }
      } catch (error) {
        console.log('원형 오버레이 스타일 적용 실패:', error);
      }
    }, 100);

    // 반짝이는 효과를 위한 애니메이션
    let opacity = 0.2;
    let increasing = true;

    const animateCircle = () => {
      if (increasing) {
        opacity += 0.03;
        if (opacity >= 0.7) {
          increasing = false;
        }
      } else {
        opacity -= 0.03;
        if (opacity <= 0.2) {
          increasing = true;
        }
      }

      if (circleRef.current) {
        circleRef.current.setOptions({
          fillOpacity: opacity,
          strokeOpacity: Math.min(opacity + 0.3, 1.0)
        });
      }
    };

    // 80ms마다 애니메이션 실행 (더 부드럽게)
    const animationInterval = setInterval(animateCircle, 80);

    // ref에 저장
    markerRef.current = marker;
    circleRef.current = circleOverlay;
    animationIntervalRef.current = animationInterval;

    console.log('ListItemBox 마커 및 원형 오버레이 생성 완료:', position);

    // 클린업 함수 반환
    return cleanup;
  }, [mapInstance, position, imagePath, imageSize, circleRadius, strokeColor, fillColor, onMarkerClick]);

  const cleanup = () => {
    // CSS 클래스 정리
    try {
      const markerElements = document.querySelectorAll('.kakao-maps-marker');
      const circleElements = document.querySelectorAll('.kakao-maps-circle');
      
      markerElements.forEach(marker => {
        marker.classList.remove(styles.markerImage, styles.clickedMarker);
      });
      
      circleElements.forEach(circle => {
        circle.classList.remove(styles.locationCircle);
      });
    } catch (error) {
      console.log('CSS 클래스 정리 실패:', error);
    }
    
    // 카카오맵 요소들 정리
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return cleanup;
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음 (카카오맵 오버레이만 관리)
  return null;
};

ListItemBox.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  mapInstance: PropTypes.object.isRequired,
  onMarkerClick: PropTypes.func,
  imagePath: PropTypes.string,
  imageSize: PropTypes.number,
  circleRadius: PropTypes.number,
  strokeColor: PropTypes.string,
  fillColor: PropTypes.string
};

ListItemBox.defaultProps = {
  imagePath: '/src/assets/images/character/RINO_Face.png',
  imageSize: 60,
  circleRadius: 20,
  strokeColor: '#87CEEB',
  fillColor: '#FFFFFF'
};

export default ListItemBox;
