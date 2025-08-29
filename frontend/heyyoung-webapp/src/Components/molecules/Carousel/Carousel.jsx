import React, { useState, useRef, useEffect } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 슬라이드 클릭 핸들러
  const handleSlideClick = (slide, index) => {
    if (slide.onClick) {
      slide.onClick();
    }
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

  // 자동 슬라이드 (선택사항)
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  if (slides.length === 0) {
    return <div className={styles.empty}>슬라이드가 없습니다.</div>;
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
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={styles.slide}
              onClick={() => handleSlideClick(slide, index)}
              style={{ cursor: slide.onClick ? 'pointer' : 'default' }}
            >
              <div className={styles.slideContent}>
                <div className={styles.imageContainer}>
                  <img 
                    src={slide.image} 
                    alt={slide.title || `슬라이드 ${index + 1}`}
                    className={styles.slideImage}
                    draggable={false}
                  />
                </div>
                <div className={styles.textContent}>
                  <h3 className={styles.title}>{slide.title}</h3>
                  <p className={styles.subtitle}>{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 페이지 인디케이터 */}
      {slides.length > 1 && (
        <div className={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentSlide ? styles.activeIndicator : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
