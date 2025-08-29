import React, { useState, useRef } from 'react';
import PartnershipCard from './PartnershipCard';
import CarouselControls from './CarouselControls';
import styles from './PartnershipCarouselBanner.module.css';



export default function PartnershipCarouselBanner({
  width = "350px",
  height = "480px",
  background = "linear-gradient(180deg, #DDD7FF 0%, #F9E8DA 100%)",
  borderRadius = "16px",
  partnerships = [],
  children,
  showControls = true
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    if (partnerships.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % partnerships.length);
    }
  };

  const prevSlide = () => {
    if (partnerships.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + partnerships.length) % partnerships.length);
    }
  };

  // 터치/마우스 이벤트 핸들러
  const handleTouchStart = (e) => {
    if (partnerships.length <= 1) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || partnerships.length <= 1) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || partnerships.length <= 1) return;
    
    const diff = startX - currentX;
    const threshold = 50; // 슬라이드 전환을 위한 최소 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 - 다음 슬라이드
        nextSlide();
      } else {
        // 오른쪽으로 스와이프 - 이전 슬라이드
        prevSlide();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // 기본 제휴 정보 (partnerships가 없을 때 사용) - 새로운 데이터 구조
  const defaultPartnerships = [
    {
      id: 1,
      shopName: "스타벅스 관악서울대입구R점",
      shopAddress: "서울 관악구 관악로 158",
      tag: "카페",
      terms: "10% off for university students",
      hostName: "총학생회"
    },
    {
      id: 2,
      shopName: "스타벅스 서울대입구역점",
      shopAddress: "서울 관악구 남부순환로 1812",
      tag: "카페",
      terms: "10% off for university students",
      hostName: "총학생회"
    },
    {
      id: 3,
      shopName: "스타벅스 서울대입구역8번출구점",
      shopAddress: "서울 관악구 남부순환로 1831",
      tag: "카페",
      terms: "10% off for university students",
      hostName: "총학생회"
    },
    {
      id: 4,
      shopName: "올리브영 관악 타운",
      shopAddress: "서울 관악구 관악로 173",
      tag: "뷰티",
      terms: "10% off for university students",
      hostName: "컴퓨터공학과 학생회"
    },
    {
      id: 5,
      shopName: "올리브영 서울대입구역점",
      shopAddress: "서울 관악구 남부순환로 1840 올리브영",
      tag: "뷰티",
      terms: "10% off for university students",
      hostName: "컴퓨터공학과 학생회"
    }
  ];

  // partnerships prop이 있으면 사용하고, 없으면 목데이터 사용
  const displayPartnerships = partnerships && partnerships.length > 0 ? partnerships : defaultPartnerships;

  if (displayPartnerships.length === 0) {
    return <div className={styles.noDataMessage}>제휴 정보가 없습니다.</div>;
  }

  const isSingleSlide = displayPartnerships.length <= 1;

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.carouselWrapper} ${isSingleSlide ? styles.single : ''}`}
        ref={carouselRef}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.carouselTrack}>
          <div 
            className={`${styles.carouselSlides} ${isDragging ? styles.dragging : ''}`}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`
            }}
          >
            {displayPartnerships.map((partnership, index) => (
              <div key={partnership.id || index} className={styles.slide}>
                <PartnershipCard
                  partnership={partnership}
                  width={width}
                  height={height}
                  background={background}
                  borderRadius={borderRadius}
                >
                  {children}
                </PartnershipCard>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        {/* <CarouselControls
          currentSlide={currentSlide}
          totalSlides={displayPartnerships.length}
          onNext={nextSlide}
          onPrev={prevSlide}
          showControls={showControls}
        /> */}
      </div>
    </div>
  );
}
