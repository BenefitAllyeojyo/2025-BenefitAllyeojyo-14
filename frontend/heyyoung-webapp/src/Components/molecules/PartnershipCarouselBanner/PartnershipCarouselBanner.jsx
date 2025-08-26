import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopTextModule from '../TextGrp/ShopTextModule';
import { LongVioletBtn } from '../../atoms/Button';

export default function PartnershipCarouselBanner({
  width = "350px",
  height = "480px",
  background = "linear-gradient(180deg, #DDD7FF 0%, #F9E8DA 100%)",
  borderRadius = "16px",
  partnerships = [],
  children
}) {
  const navigate = useNavigate();
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

  // 기본 제휴 정보 (partnerships가 없을 때 사용)
  const defaultPartnerships = [
    {
      id: 1,
      shopName: "레드버튼 강북점",
      shopAddress: "서울특별시 강북구 한천로 139길 42",
      tag: "보드게임카페"
    }
  ];

  const displayPartnerships = partnerships.length > 0 ? partnerships : defaultPartnerships;

  if (displayPartnerships.length === 0) {
    return <div>제휴 정보가 없습니다.</div>;
  }

  return (
    <div 
      style={{ 
        paddingLeft: '15px',
        paddingTop: '20px'
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          margin: 0,
          overflow: 'hidden',
          borderRadius: 0,
          cursor: partnerships.length > 1 ? 'grab' : 'default',
          userSelect: 'none',
          touchAction: 'pan-y pinch-zoom'
        }}
        ref={carouselRef}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}>
          <div 
            style={{
              display: 'flex',
              transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
              transform: `translateX(-${currentSlide * 100}%)`,
              width: '100%'
            }}
          >
            {displayPartnerships.map((partnership, index) => (
              <div 
                key={partnership.id || index}
                style={{
                  flex: '0 0 100%',
                  width: '100%',
                  padding: 0,
                  boxSizing: 'border-box',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width,
                    height,
                    background,
                    borderRadius,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {/* 헤이영 맞춤 추천 텍스트 */}
                  <div style={{
                    color: 'var(--neutral-dark-dark)',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: '16px',
                    letterSpacing: '0.12px',
                    alignSelf: 'flex-start',
                    marginLeft: '25px',
                    marginBottom: '10px'
                  }}>
                    헤이영 맞춤 추천
                  </div>
                  
                  {/* ShopTextModule */}
                  <div style={{
                    alignSelf: 'flex-start',
                    marginLeft: '25px',
                    marginBottom: '10px'
                  }}>
                    <ShopTextModule
                      shopName={partnership.shopName}
                      shopAddress={partnership.shopAddress}
                      tag={partnership.tag}
                      disabled={false}
                    />
                  </div>

                  {/* 흰색 박스 */}
                  <div style={{
                    alignSelf: 'flex-start',
                    marginLeft: '25px',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    background: '#FFF',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.10)',
                    width: '298px',
                    height: '271px',
                    flexShrink: 0
                  }}>
                  </div>

                  {/* 롱 바이올렛 버튼  '헤이영 pay로 제휴 결제하기' */}
                  <div style={{
                    alignSelf: 'flex-start',
                    marginLeft: '25px',
                    marginBottom: '10px'
                  }}>
                    <LongVioletBtn
                      label="제휴 혜택 상세 보기"
                      onClick={() => {
                        console.log('헤이영 pay 결제 버튼 클릭', partnership.id);
                        navigate('/payment');
                      }}
                    />
                  </div>
                  
                  {children}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
