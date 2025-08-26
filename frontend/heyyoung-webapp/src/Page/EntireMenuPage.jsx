import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import entireMenuImage from '../assets/images/pages/entire-menu.PNG'

export default function EntireMenuPage() {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/')
  }

  const handlePartnershipClick = () => {
    console.log('제휴존 배너 클릭됨!')
    navigate('/partnership')
  }

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      <BackgroundImage 
        src={entireMenuImage}
        alt="전체메뉴 배경"
      >
        {/* 제휴존 배너 - 취업존 아래 위치 */}
        <div 
          style={{
            position: 'absolute',
            top: '56%', // 하단 탭바 위로 120px
            left: '54%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '20px',
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={handlePartnershipClick}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateX(-50%) scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateX(-50%) scale(1)'
          }}
        >
          <span style={{
            fontFamily: 'OneShinhan',
            fontSize: '14px',
            color: 'var(--Neutral-Dark-Darkest, #1B1546)',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
            letterSpacing: '0.5px'
          }}>
            제휴존
          </span>
        </div>
      </BackgroundImage>

      {/* 하단 탭 이미지 - AppShell 컨테이너 하단에 고정 */}
      <BackgroundBottomTabImage 
        currentTab="menu"
        position="absolute"
      />
    </div>
  )
}