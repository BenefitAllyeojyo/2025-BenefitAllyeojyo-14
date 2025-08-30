import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import entireMenuImage from '../assets/images/pages/entire-menu.PNG'
import logoImage from '../assets/images/logo.png'

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
        {/* 제휴존 투명 클릭 영역 */}
        <div 
          style={{
            position: 'absolute',
            top: '53%', // 하단 탭바 위로 120px
            left: '70%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            cursor: 'pointer',
            width: '200px',
            height: '40px',
            // 투명 배경으로 시각적으로 보이지 않음
          }}
          onClick={handlePartnershipClick}
        />
      </BackgroundImage>

      {/* 로고 - 상단 왼쪽에 배치 */}
      <div
        style={{
          position: 'absolute',
          top: '55px',
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

      {/* 하단 탭 이미지 - AppShell 컨테이너 하단에 고정 */}
      {/* <BackgroundBottomTabImage 
        currentTab="menu"
        position="absolute"
      /> */}
    </div>
  )
}