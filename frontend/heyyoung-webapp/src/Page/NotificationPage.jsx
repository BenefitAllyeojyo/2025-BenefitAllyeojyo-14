import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import { BackButton } from '../Components/atoms/Button'
import { NotificationItem } from '../Components/molecules/TextGrp'
import notificationImage from '../assets/images/pages/notification.png'
import NotificationHeader from '../assets/images/notification/notificationHeader.png'
import NotificationBottom from '../assets/images/notification/notificationBottom.png'
export default function NotificationPage() {
  const navigate = useNavigate()

  // Mock 알림 데이터
  const mockNotifications = [
    {
      id: 1,
      partnershipId: 1, // 스타벅스
      title: "스타벅스 할인 혜택",
      subtitle: "학생증 제시 시 20% 할인",
      description: "모든 음료 메뉴에 적용되는 특별 할인"
    },
    {
      id: 2,
      partnershipId: 2, // 올리브영
      title: "올리브영 제휴 혜택",
      subtitle: "학생증 제시 시 15% 할인",
      description: "화장품, 생활용품 등 모든 상품에 적용"
    },
    {
      id: 3,
      partnershipId: 3, // CU 편의점
      title: "CU 편의점 할인",
      subtitle: "학생증 제시 시 10% 할인",
      description: "음료, 간식, 생활용품 할인 혜택"
    }
  ]

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#F6F6F6'
    }}>
      {/* 뒤로가기 버튼 영역 */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '20px',
          zIndex: 10
        }}
      >
        <BackButton />
      </div>

      {/* NotificationHeader, div(스크롤), NotificationBottom 순서로 배치 */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* NotificationHeader */}
        <img 
          src={NotificationHeader} 
          alt="알림 헤더"
          style={{
            width: '100%',
            height: 'auto'
          }}
        />
        
        {/* div(스크롤 되는, NotificationHeader와 NotificationBottom를 제외한 높이 크기) */}
        <div style={{
          overflow: 'auto',
          height: '500px', // 스크롤 영역 높이 지정
        }}>
          {/* 알림 컴포넌트들을 map으로 반복 */}
          {mockNotifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
        
        {/* NotificationBottom */}
      </div>
    </div>
  )
}
