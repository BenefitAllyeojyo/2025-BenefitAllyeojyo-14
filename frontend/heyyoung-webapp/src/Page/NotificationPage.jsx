import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import { BackButton } from '../Components/atoms/Button'
import notificationImage from '../assets/images/pages/notification.png'

export default function NotificationPage() {
  const navigate = useNavigate()

  return (
    <BackgroundImage 
      src={notificationImage}
      alt="알림페이지 배경"
    >
      
      {/* 뒤로가기 버튼 영역 */}
      <div
        style={{
          position: 'absolute',
          top: '57px',
          left: '20px',
          zIndex: 10
        }}
      >
        <BackButton />
      </div>
    </BackgroundImage>
  )
}
