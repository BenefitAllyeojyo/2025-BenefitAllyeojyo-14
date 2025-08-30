import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StoreDetailCard.module.css';
import ShopTextModule from './ShopTextModule';
import AboutTextModule from './AboutTextModule';
import HostInfoModule from './HostInfoModule';
import { LongPurpleBtn } from '@/Components/atoms/Button';
import ImageCarousel from './ImageCarousel';

const StoreDetailCard = ({ storeDetail }) => {
  const navigate = useNavigate();
  
  if (!storeDetail) return null;

  const { partnershipBranchDto, companyName, discountRate, discountAmount, terms, universityName } =
    storeDetail;

  const handlePaymentClick = () => {
    // partnershipBranchDto를 세션스토리지에 저장하고 결제 페이지로 이동
    if (partnershipBranchDto) {
      sessionStorage.setItem('paymentData', JSON.stringify(partnershipBranchDto));
      console.log('결제 데이터 저장:', partnershipBranchDto);
    }
    navigate('/payment');
  };

  return (
    <div className={styles.cardContainer}>
      {/* 가게 이미지 */}
      <div className={styles.imageSection}>
        {partnershipBranchDto?.images && partnershipBranchDto.images.length > 0 ? (
          <ImageCarousel 
            images={partnershipBranchDto.images}
            autoPlay={true}
            interval={5000}
          />
        ) : (
          <div className={styles.defaultImage}>
            <span>이미지 없음</span>
          </div>
        )}
        {/* 캐릭터 이미지 (오른쪽에 겹쳐서 표시) */}
        <div className={styles.characterImage}>
          <img
            src={import.meta.env.BASE_URL + "assets/images/character/PLI_GO.svg"}
            alt="캐릭터"
            className={styles.character}
          />
        </div>
      </div>

      {/* 가게 정보 */}
      <div className={styles.infoSection}>
        <ShopTextModule
          shopAddress={partnershipBranchDto?.address}
          shopName={partnershipBranchDto?.name}
          disabled={false}
        />
        {/* ABOUT 섹션 */}
        <AboutTextModule
          Content={terms}
          discountRate={discountRate}
          discountAmount={discountAmount}
        />

        <HostInfoModule Host={partnershipBranchDto?.hostName} />

        <LongPurpleBtn label="헤이영 Pay로 제휴 결제하기" onClick={handlePaymentClick} />
      </div>
    </div>
  );
};

export default StoreDetailCard;
