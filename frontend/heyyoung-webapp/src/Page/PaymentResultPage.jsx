import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeadTextModule from '../Components/molecules/TextGrp/HeadTextModule'
import PayTimeModule from '../Components/molecules/TextGrp/PayTimeModule'
import PayTitleModule from '../Components/molecules/TextGrp/PayTitleModule'
import PayResultModule from '../Components/molecules/TextGrp/PayResultModule'
import PayItemModule from '../Components/molecules/TextGrp/PayItemModule'
import { LongPurpleBtn } from '../Components/atoms/Button'
import PartnershipDetailCard from '../Components/molecules/TextGrp/PartnershipDetailCard'

export default function PaymentResultPage() {
  const navigate = useNavigate()
  const [paymentResultData, setPaymentResultData] = useState(null)
  const [partnershipData, setPartnershipData] = useState(null)

  // sessionStorage에서 결제 결과 데이터 가져오기
  useEffect(() => {
    const storedData = sessionStorage.getItem('paymentResultData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setPaymentResultData({
          header: {
            title: "결제 완료",
            time: parsedData.paymentTime || "결제 시간 정보 없음"
          },
          paymentInfo: {
            subTitle: "결제완료",
            shopName: parsedData.shopName || "매장명 없음"
          },
          paymentDetails: {
            originalAmount: parsedData.originalAmount || 0,
            discountAmount: parsedData.discountAmount || 0,
            finalAmount: parsedData.finalAmount || 0
          },
          button: {
            label: "메인으로",
            onClick: () => {
              navigate('/')
            }
          }
        })

        // Partnership 데이터 설정
        setPartnershipData({
          shopName: parsedData.shopName || "매장명 없음",
          shopAddress: parsedData.shopAddress || "주소 정보 없음",
          aboutText: parsedData.shopAddress || "제휴 정보 없음",
          hostTitle: "학교 제휴사업 주최자",
          hostName: "싸피대학교 총학생회"
        })

        // 결제 데이터 처리 완료
      } catch (error) {
        // 파싱 실패 시 기본 데이터 사용
        // 파싱 실패 시 기본 데이터 사용
        setDefaultData()
      }
    } else {
      // 데이터가 없으면 기본 데이터 사용
      setDefaultData()
    }
  }, [navigate])

  // 기본 데이터 설정
  const setDefaultData = () => {
    setPaymentResultData({
      header: {
        title: "결제 완료",
        time: "결제 시간 정보 없음"
      },
      paymentInfo: {
        subTitle: "결제완료",
        shopName: "매장명 없음"
      },
      paymentDetails: {
        originalAmount: 0,
        discountAmount: 0,
        finalAmount: 0
      },
      button: {
        label: "메인으로",
        onClick: () => {
          navigate('/')
        }
      }
    })

    setPartnershipData({
      shopName: "매장명 없음",
      shopAddress: "주소 정보 없음",
      aboutText: "제휴 정보 없음",
      hostTitle: "학교 제휴사업 주최자",
      hostName: "싸피대학교 총학생회"
    })
  }

  // 데이터가 로드되지 않았으면 로딩 표시
  if (!paymentResultData || !partnershipData) {
    return (
      <div style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ color: '#542BA8', fontSize: '16px' }}>
          결제 결과를 불러오는 중...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      overflow: 'auto',
      backgroundColor: '#FFFFFF',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '20px'
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
        alignItems: 'flex-start',
        height: '200px', // 높이 줄임
        minHeight: '200px', // 최소 높이 보장
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
        <div style={{ 
          marginTop: '100px',
          position: 'relative',
          zIndex: 9999
        }}>
          <LongPurpleBtn 
            label={paymentResultData.button.label}
            onClick={paymentResultData.button.onClick}
          />
        </div>
      </div>
      
      {/* PartnershipDetailCard - 하단에 딱 붙음 */}
      <div style={{
        marginTop: '30px',
        height: 'calc(100vh - 60px - 200px - 141px - 30px)', // 100vh - HeadTextModule - PayTimeModule - PayTitleModule - PayItemModule - PayResultModule - 구분선 - LongPurpleBtn - marginTop
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end' // 하단에 배치
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
