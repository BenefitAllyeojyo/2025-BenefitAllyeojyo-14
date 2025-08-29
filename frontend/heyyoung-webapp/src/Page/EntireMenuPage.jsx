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
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <BackgroundImage 
        src={entireMenuImage}
        alt="전체메뉴 배경"
      >
        {/* 제휴존 투명 클릭 공간 */}
        <div 
          style={{
            position: 'absolute',
            top: '53%', // 하단 탭바 위로 120px
            left: '54%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            cursor: 'pointer',
            width: '80px',
            height: '40px',
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={handlePartnershipClick}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateX(-50%) scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateX(-50%) scale(1)'
          }}
        />
      </BackgroundImage>

      {/* 하단 탭 이미지 - AppShell 컨테이너 하단에 고정 */}
      {/* <BackgroundBottomTabImage 
        currentTab="menu"
        position="absolute"
      /> */}
    </div>
  )
}