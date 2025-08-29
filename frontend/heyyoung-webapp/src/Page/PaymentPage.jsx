import React, { useState, useEffect } from 'react'
import { PayHeadButton } from '../Components/atoms/Button'
import ShopTextModule from '../Components/molecules/TextGrp/ShopTextModule'
import { PayPersonalInfo } from '../Components/molecules/CardGrp'
import QRCode from '../Components/atoms/QRCode/QRCode'
import CountdownTimer from '../Components/atoms/CountdownTimer/CountdownTimer'
import TimeoutModal from '../Components/atoms/TimeoutModal/TimeoutModal'
import PaymentGuide from '../Components/molecules/PaymentGuide/PaymentGuide'
import { fetchQRData } from '../services/api'

export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  // sessionStorage에서 결제 데이터 가져오기
  useEffect(() => {
    const storedData = sessionStorage.getItem('paymentData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setPaymentData(parsedData)
        console.log('결제 페이지에서 받은 데이터:', parsedData)
      } catch (error) {
        console.error('결제 데이터 파싱 실패:', error)
      }
    }
  }, [])

  // Mock data - 추후 실제 데이터로 교체 가능 (paymentData가 있으면 사용)
  const shopData = paymentData ? {
    shopName: paymentData.name || "매장명 없음",
    shopAddress: paymentData.address || "주소 정보 없음",
    tag: paymentData.category || "" // 카테고리를 태그로 사용
  } : {
    shopName: "레드버튼 보드게임 X 싸피대학교 총학생회",
    shopAddress: "학생증 및 교직원증 제시 시 식음료 메뉴 20% 할인\n- 8인 이상 단체 예약시 게임비 10% 추가 할인",
    tag: "" // 태그 버튼 없음
  }

  const userData = {
    userName: "김싸피 (1448308)",
    userInfo: "싸피대학교, 재학생 4학년"
  }

  // QR 데이터를 API에서 가져오기
  useEffect(() => {
    const loadQRData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fetchQRData()
        setQrData({
          qrString: result.qrToken,
          size: 200
        })
      } catch (err) {
        console.error('QR 데이터 로드 실패:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadQRData()
  }, [])

  const handleTimeout = () => {
    setIsModalOpen(true)
  }

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100%', 
      overflow: 'auto',
      overflowX: 'hidden',
      backgroundColor: '#FFFFFF',
      width: '100%',
      boxSizing: 'border-box',
      paddingBottom: '100px' // 하단 여백 추가
    }}>
      <PayHeadButton subtitle="오늘 - Aug 15" />
      
      <div style={{ padding: '8px 24px' }}>
        <div style={{ whiteSpace: 'pre-line' }}>
          <ShopTextModule 
            shopName={shopData.shopName}
            shopAddress={shopData.shopAddress}
            tag={shopData.tag}
            disabled={false} // 태그 버튼 숨김 (빈 태그 + disabled=false)
          />
        </div>
      </div>
      
      <PayPersonalInfo 
        userName={userData.userName}
        userInfo={userData.userInfo}
      />
      
      {/* QR 코드 섹션 */}
      <div style={{ padding: '5px 0' }}>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: '#542BA8',
            fontSize: '16px'
          }}>
            QR 코드를 불러오는 중...
          </div>
        ) : error ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: '#ff6b6b',
            fontSize: '14px',
            textAlign: 'center',
            padding: '0 20px'
          }}>
            QR 코드를 불러올 수 없습니다.<br />
            {error}
          </div>
        ) : qrData ? (
          <>
            <QRCode 
              qrData={qrData.qrString}
              size={qrData.size}
            />
            <CountdownTimer 
              initialSeconds={60}
              onTimeout={handleTimeout}
            />
          </>
        ) : null}
      </div>
      
      {/* 하단 안내 섹션 */}
      <PaymentGuide />
      
      {/* 시간 만료 모달 */}
      <TimeoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
