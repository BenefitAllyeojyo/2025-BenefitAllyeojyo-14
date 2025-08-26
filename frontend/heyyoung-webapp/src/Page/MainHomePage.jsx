import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import BackgroundBottomTabImage from '../Components/atoms/BackgroundBottomTabImage'
import Banner from '../Components/atoms/Banner'
import { BellButton } from '../Components/atoms/Button'
import mainHomeImage from '../assets/images/pages/main-home.png'

export default function MainHomePage() {
  const navigate = useNavigate()

  const handleBannerClick = () => {
    console.log('메인 배너 클릭됨!')
    navigate('/partnership') // 파트너십 리스트 페이지로 이동
  }

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      {/* 상단 메인 이미지 */}
      <div style={{ position: 'relative' }}>
        <img src={mainHomeImage} alt="메인홈" style={{ display:'block', width:'100%', height: 'auto' }} />
        
        {/* 메인 이미지 위의 버튼들 */}
        <div
          style={{
            position: 'absolute',
            top: '57px',
            right: '20px',
            zIndex: 10
          }}
        >
          <BellButton />
        </div>


        {/* 메인 이미지 위에 클릭 영역 (투명) */}
        <div 
          style={{
            position: 'absolute',
            top: '57%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            width: '320px',
            height: '120px',
            cursor: 'pointer'
          }}
          onClick={handleBannerClick}
        />
      </div>

      {/* 하단 탭 이미지 - AppShell 컨테이너 하단에 고정 */}
      <BackgroundBottomTabImage 
        currentTab="home"
        position="absolute"
      />
    </div>
  )
}