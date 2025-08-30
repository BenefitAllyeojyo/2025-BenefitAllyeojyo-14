import React from 'react'
import styles from './PartnershipDetailCard.module.css'
import ShopInfoTextModule from './ShopInfoTextModule'
import AboutTextModule from './AboutTextModule'
import HostInfoModule from './HostInfoModule'

export default function PartnershipDetailCard({
  shopName = "레드버튼 보드게임",
  shopAddress = "서울특별시 강북구 한천로139길 42",
  aboutText = "학생증 및 교직원증 제시 시 식음료 메뉴 20% 할인\n- 8인 이상 단체 예약시 게임비 10% 추가 할인",
  hostTitle = "학교 제휴사업 주최자",
  hostName = "싸피대학교 총학생회"
}) {
  return (
    <div className={styles.partnershipDetailCard}>
      <ShopInfoTextModule 
        shopName={shopName}
        shopAddress={shopAddress}
        tag="" // 태그 끄기
      />
      <AboutTextModule 
        aboutText={aboutText}
      />
      <HostInfoModule 
        hostTitle={hostTitle}
        hostName={hostName}
      />
    </div>
  )
}
