import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShopTextModule from '../TextGrp/ShopTextModule';
import { LongVioletBtn } from '../../atoms/Button';
import PartnershipDetailCard from './PartnershipDetailCard';
import styles from './PartnershipCarouselBanner.module.css';

export default function PartnershipCard({ 
  partnership, 
  width = "350px", 
  height = "480px", 
  background = "linear-gradient(180deg, #DDD7FF 0%, #F9E8DA 100%)",
  borderRadius = "16px",
  children 
}) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      style={{
        width,
        height,
        background,
        borderRadius
      }}
    >
      {/* 헤이영 맞춤 추천 텍스트 */}
      <div className={styles.recommendationText}>
        헤이영 맞춤 추천
      </div>
      
      {/* ShopTextModule */}
      <div className={styles.shopTextContainer}>
        <ShopTextModule
          shopName={partnership.shopName}
          shopAddress={partnership.shopAddress}
          tag={partnership.tag}
          disabled={true}
        />
      </div>

      {/* PartnershipDetailCard로 교체 */}
      <div className={styles.whiteBox}>
        <PartnershipDetailCard partnership={partnership} />
      </div>

      {/* 롱 바이올렛 버튼 */}
      <div className={styles.buttonContainer}>
        <LongVioletBtn
          label="제휴 혜택 상세 보기"
          onClick={() => {
            console.log('제휴 혜택 상세보기 클릭', partnership.id);
            // store-detail 페이지로 이동하면서 id 전달
            sessionStorage.setItem('selectedStoreId', partnership.id);
            navigate('/store-detail');
          }}
        />
      </div>
      
      {children}
    </div>
  );
}
