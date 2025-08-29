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
      title: "트래블카드 만들면 1만원 받고",
      subtitle: "새로운 혜택이 쿠폰함에 들어왔어요.",
      description: "지금 바로 확인하고 혜택을 받으세요"
    },
    {
      id: 2,
      title: "스타벅스 할인 쿠폰",
      subtitle: "학생증 제시 시 20% 할인",
      description: "오늘 하루만 사용 가능한 특별 혜택"
    },
    {
      id: 3,
      title: "새로운 제휴 매장 추가",
      subtitle: "올리브영, 이마트 등 5개 매장",
      description: "더 많은 혜택을 누려보세요"
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
          top: '10px',
          left: '20px',
          zIndex: 10
        }}
      >
        <BackButton />
      </div>

      {/* NotificationHeader, div(스크롤), NotificationBottom 순서로 배치 */}
      <div style={{
        position: 'absolute',
        top: 0,
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
          flex: 1,
          overflow: 'auto',
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
        <img 
          src={NotificationBottom} 
          alt="알림 하단"
          style={{
            width: '100%',
            height: 'auto'
          }}
        />
      </div>
    </div>
  )
}
