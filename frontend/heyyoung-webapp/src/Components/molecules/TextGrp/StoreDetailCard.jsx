import React from 'react';
import styles from './StoreDetailCard.module.css';
import ShopTextModule from './ShopTextModule';
import AboutTextModule from './AboutTextModule';
import HostInfoModule from './HostInfoModule';
import { LongPurpleBtn } from '@/Components/atoms/Button';

const StoreDetailCard = ({ storeDetail }) => {
  if (!storeDetail) return null;

  const { partnershipBranchDto, companyName, discountRate, discountAmount, terms, universityName } =
    storeDetail;

  return (
    <div className={styles.cardContainer}>
      {/* 가게 이미지 */}
      <div className={styles.imageSection}>
        {partnershipBranchDto?.images && partnershipBranchDto.images.length > 0 ? (
          <img
            src={partnershipBranchDto.images[0]}
            alt={partnershipBranchDto.name}
            className={styles.storeImage}
          />
        ) : (
          <div className={styles.defaultImage}>
            <span>이미지 없음</span>
          </div>
        )}
        {/* 캐릭터 이미지 (오른쪽에 겹쳐서 표시) */}
        {/* <div className={styles.characterImage}>
          <img 
            src="/src/assets/images/character/PLI_Face.png" 
            alt="캐릭터"
            className={styles.character}
          />
        </div> */}
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

        <HostInfoModule Host= "싸피대학교 총학생회" />

        <LongPurpleBtn label="헤이영 Pay로 제휴 결제하기" onClick={() => {}}/>
      </div>

      {/* 결제 버튼 */}
    </div>
  );
};

export default StoreDetailCard;
