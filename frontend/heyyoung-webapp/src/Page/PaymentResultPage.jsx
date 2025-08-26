import React from 'react'
import HeadTextModule from '../Components/molecules/TextGrp/HeadTextModule'
import PayTimeModule from '../Components/molecules/TextGrp/PayTimeModule'
import PayTitleModule from '../Components/molecules/TextGrp/PayTitleModule'
import PayResultModule from '../Components/molecules/TextGrp/PayResultModule'
import PayItemModule from '../Components/molecules/TextGrp/PayItemModule'
import { LongPurpleBtn } from '../Components/atoms/Button'
import PartnershipDetailCard from '../Components/molecules/TextGrp/PartnershipDetailCard'

export default function PaymentResultPage() {
  // 목데이터
  const paymentResultData = {
    header: {
      title: "결제 완료",
      time: "7월 27일 (일) 오후 1:20"
    },
    paymentInfo: {
      subTitle: "결제완료",
      shopName: "레드버튼 보드게임"
    },
    paymentDetails: {
      originalAmount: 10000,
      discountAmount: -1000,
      finalAmount: 8000
    },
    button: {
      label: "메인으로",
      onClick: () => {
        console.log('메인으로 버튼 클릭');
        // 여기에 메인 페이지로 이동하는 로직 추가
      }
    }
  };

  const partnershipData = {
    shopName: "레드버튼 보드게임",
    shopAddress: "서울특별시 강북구 한천로139길 42",
    aboutText: "학생증 및 교직원증 제시 시 식음료 메뉴 20% 할인\n- 8인 이상 단체 예약시 게임비 10% 추가 할인",
    hostTitle: "학교 제휴사업 주최자",
    hostName: "싸피대학교 총학생회"
  };

  return (
    <div style={{
      position: 'relative',
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#FFFFFF',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <HeadTextModule title={paymentResultData.header.title} />
      <PayTimeModule time={paymentResultData.header.time} />
      
      {/* 메인 콘텐츠 영역 */}
      <div style={{
        width: '100%',
        maxWidth: '375px',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        <div style={{ marginLeft: '-8px' }}>
          <PayTitleModule 
            subTitle={paymentResultData.paymentInfo.subTitle}
            Title={paymentResultData.paymentInfo.shopName}
          />
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <PayItemModule 
            Amount={paymentResultData.paymentDetails.originalAmount}
          />
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <PayResultModule 
            label="제휴 혜택 할인"
            Amount={paymentResultData.paymentDetails.discountAmount}
            fontSize="12px"
          />
        </div>
        
        {/* 구분선 */}
        <div style={{
          width: '330px',
          height: '1px',
          background: '#CBCBCB',
          margin: '24px auto',
          alignSelf: 'center'
        }} />
        
        <div style={{ marginTop: '8px' }}>
          <PayResultModule 
            label="결제액"
            Amount={paymentResultData.paymentDetails.finalAmount}
            fontSize="16px"
          />
        </div>
        
        {/* 메인으로 버튼 */}
        <div style={{ marginTop: '141px' }}>
          <LongPurpleBtn 
            label={paymentResultData.button.label}
            onClick={paymentResultData.button.onClick}
          />
        </div>
      </div>
      
      {/* PartnershipDetailCard - 하단에 딱 붙음 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%'
      }}>
        <PartnershipDetailCard 
          shopName={partnershipData.shopName}
          shopAddress={partnershipData.shopAddress}
          aboutText={partnershipData.aboutText}
          hostTitle={partnershipData.hostTitle}
          hostName={partnershipData.hostName}
        />
      </div>
    </div>
  )
}
