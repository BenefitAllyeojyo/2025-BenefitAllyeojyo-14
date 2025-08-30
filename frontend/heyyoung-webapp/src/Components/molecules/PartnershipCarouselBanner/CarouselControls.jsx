import React from 'react';
import styles from './PartnershipCarouselBanner.module.css';

export default function CarouselControls({ 
  currentSlide, 
  totalSlides, 
  onNext, 
  onPrev,
  showControls = true 
}) {
  if (!showControls || totalSlides <= 1) {
    return null;
  }

  return (
    <div className={styles.controls}>
      <button 
        className={styles.controlButton}
        onClick={onPrev}
        aria-label="이전 슬라이드"
      >
        ‹
      </button>
      
      <div className={styles.indicators}>
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => {
              // 직접 특정 슬라이드로 이동하는 로직을 여기에 추가할 수 있습니다
            }}
            aria-label={`${index + 1}번째 슬라이드`}
          />
        ))}
      </div>
      
      <button 
        className={styles.controlButton}
        onClick={onNext}
        aria-label="다음 슬라이드"
      >
        ›
      </button>
    </div>
  );
}
