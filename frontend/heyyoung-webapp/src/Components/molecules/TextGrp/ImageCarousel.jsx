import React, { useState, useRef, useEffect } from 'react';
import styles from './ImageCarousel.module.css';

export default function ImageCarousel({ images = [], autoPlay = true, interval = 5000 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef(null);

  const totalSlides = images.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 터치/마우스 이벤트 핸들러
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
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

  // 자동 슬라이드
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;

    const intervalId = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(intervalId);
  }, [currentSlide, totalSlides, autoPlay, interval]);

  if (totalSlides === 0) {
    return <div className={styles.empty}>이미지가 없습니다.</div>;
  }

  return (
    <div 
      className={styles.carouselContainer}
      ref={carouselRef}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.carouselWrapper}>
        <div 
          className={styles.carouselTrack}
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
          }}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.slide}>
              <div className={styles.slideContent}>
                <img 
                  src={image} 
                  alt={`이미지 ${index + 1}`}
                  className={styles.slideImage}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      {totalSlides > 1 && (
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
