import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BellButton from '../Components/atoms/Button/BellButton'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import { SavingBox } from '../Components/molecules/TextGrp'
import BigCardBtn from '../Components/atoms/Button/BigCardBtn'
import { ZoneBox } from '../Components/molecules/CardGrp'
import logoImage from '../assets/images/logo.png'
import solGoImage from '../assets/images/character/SOL_GO.png'
import { fetchUserTotalSavings } from '../services/api'

// Mock Data
const mockSavingData = {
  leftText: "이번달 아낀 금액",
  rightText: "로딩 중..." // 초기값, 실제로는 API에서 가져옴
}

const mockPartnershipData = {
  branchId: 1, // API 연결용 branchId
  title: "설빙 강남점",
  subtitle: "모든 메뉴 10% 할인",
  distance: "현 위치에서 540m"
}

export default function PartnershipMainPage() {
  const navigate = useNavigate()
  const [savingsData, setSavingsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 저장 금액 데이터 로드
  useEffect(() => {
    const loadSavingsData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchUserTotalSavings()
        if (response.isSuccess) {
          setSavingsData(response.result)
        }
      } catch (error) {
        console.error('저장 금액 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavingsData()
  }, [])

  const handleShopClick = () => {
    navigate('/partnership-list')
  }

  return (
    <div style={{ 
      position: 'relative', 
      height: '720px',
      backgroundColor: '#EFF0FC',
      overflow: 'hidden',
    }}>
      {/* 로고 - 상단 왼쪽에 배치 */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '9px',
          zIndex: 10
        }}
      >
        <img 
          src={logoImage} 
          alt="로고" 
          style={{ 
            height: '50px', 
            width: 'auto',
            display: 'block'
          }} 
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ 
        padding: '20px', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* 상단 알림 버튼 - 오른쪽 */}
        <div style={{
          alignSelf: 'flex-end',
          marginBottom: '20px'
        }}>
          <BellButton />
        </div>

        {/* SavingBox */}
        <SavingBox 
          leftText={mockSavingData.leftText}
          rightText={savingsData ? `${savingsData.totalSavedAmount.toLocaleString('ko-KR')}원` : isLoading ? '로딩 중...' : '0원'}
        />

        {/* ZoneBox들 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          marginTop: '20px'
        }}>
          <ZoneBox 
            image="shop"
            text="실시간 추천 제휴 보기"
            onClick={handleShopClick}
          />
          <ZoneBox 
            image="map"
            text="캠퍼스 제휴지도 보기"
            onClick={() => navigate('/benefit-map')}
          />
        </div>
      </div>

      {/* 하단 박스 */}
      <div style={{
        position: 'absolute',
        bottom: '66px', // 하단 탭 이미지 바로 위
        left: '0',
        width: '375px',
        height: '280px', // 222px에서 320px로 증가
        background: '#F3F6F9',
        padding: '60px 20px 20px 20px' // 위쪽 패딩을 60px로 늘림
      }}>
        {/* 실시간 추천 제휴처 제목 */}
        <div style={{
          color: 'var(--Neutral-Dark-Darkest, #1B1546)',
          fontFamily: 'OneShinhan',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 'normal',
          marginBottom: '16px'
        }}>
          실시간 추천 제휴처
        </div>

        {/* 제휴처 카드 */}
        <BigCardBtn
          title={mockPartnershipData.title}
          subtitle={mockPartnershipData.subtitle}
          distance={mockPartnershipData.distance}
          onClick={async () => {
            try {
              console.log('제휴처 카드 클릭 - API 호출 시작');
              
              // API 호출: /partnerships/{branchId}
              const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
              const response = await fetch(`${API_BASE_URL}/partnerships/${mockPartnershipData.branchId}`, {
                method: 'GET',
                headers: {
                  accept: '*/*',
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              console.log('Partnership API Response:', data);

              // API 응답을 세션스토리지에 저장
              if (data.result) {
                sessionStorage.setItem('storeDetailData', JSON.stringify(data.result));
                console.log('Store detail data saved to sessionStorage');
              }

              // /store-detail로 이동
              navigate('/store-detail');
            } catch (error) {
              console.error('API 호출 실패:', error);
              // 에러 발생 시에도 /store-detail로 이동 (기본 데이터 사용)
              navigate('/store-detail');
            }
          }}
        />
      </div>

      {/* 하단 탭 이미지 */}
      {/* <BackgroundBottomTabImage 
        currentTab="benefit"
      /> */}

      {/* SOL_GO 이미지 - 하단에 배치 */}
      <div
        style={{
          position: 'absolute',
          bottom: '250px',
          right: '20px',
          zIndex: 10
        }}
      >
        <img 
          src={solGoImage} 
          alt="SOL_GO" 
          style={{ 
            height: '80px', 
            width: 'auto',
            display: 'block'
          }} 
        />
      </div>
    </div>
  )
}
