import React from 'react'
import { useNavigate } from 'react-router-dom'
import BellButton from '../Components/atoms/Button/BellButton'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import { SavingBox } from '../Components/molecules/TextGrp'
import BigCardBtn from '../Components/atoms/Button/BigCardBtn'
import { ZoneBox } from '../Components/molecules/CardGrp'

// Mock Data
const mockSavingData = {
  leftText: "이번달 아낀 금액",
  rightText: "123,456,789원"
}

const mockPartnershipData = {
  title: "설빙 강남점",
  subtitle: "모든 메뉴 10% 할인",
  distance: "현 위치에서 540m"
}

export default function PartnershipMainPage() {
  const navigate = useNavigate()

  const handleShopClick = () => {
    navigate('/partnership/list')
  }

  return (
    <div style={{ 
      position: 'relative', 
      height: '100%',
      backgroundColor: '#EFF0FC',
      overflow: 'hidden'
    }}>
      {/* 메인 콘텐츠 */}
      <div style={{ 
        padding: '20px', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px', // 앱 상태바(33px) + 알림 버튼 공간(27px)
        paddingBottom: '100px' // 하단 네비게이션 공간 확보
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
          rightText={mockSavingData.rightText}
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
            onClick={() => console.log('캠퍼스 제휴지도 클릭')}
          />
        </div>
      </div>

      {/* 하단 박스 */}
      <div style={{
        position: 'absolute',
        bottom: '66px', // 하단 탭 이미지 바로 위
        left: '0',
        width: '375px',
        height: '222px',
        background: '#F3F6F9',
        padding: '20px'
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
          onClick={() => console.log('제휴처 카드 클릭')}
        />
      </div>

      {/* 하단 탭 이미지 */}
      <BackgroundBottomTabImage 
        currentTab="benefit"
      />
    </div>
  )
}
