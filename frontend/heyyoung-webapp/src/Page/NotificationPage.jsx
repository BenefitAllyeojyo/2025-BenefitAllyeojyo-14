import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BackgroundImage from '../Components/atoms/BackgroundImage'
import { BackButton } from '../Components/atoms/Button'
import { NotificationItem } from '../Components/molecules/TextGrp'
import { getNotifications } from '../services/api'
import notificationImage from '../assets/images/pages/notification.png'
import NotificationHeader from '../assets/images/notification/notificationHeader.png'
import NotificationBottom from '../assets/images/notification/notificationBottom.png'

export default function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await getNotifications(0, 3)
        
        if (response.isSuccess && response.result) {
          // 백엔드 응답 데이터를 컴포넌트에서 사용하는 형태로 변환
          const transformedNotifications = response.result.content.map((item, index) => ({
            id: index + 1, // 임시 ID
            partnershipId: item.partnershipId,
            title: item.title,
            subtitle: item.content, // content를 subtitle로 사용
            description: '' // description은 제거
          }))
          
          setNotifications(transformedNotifications)
        } else {
          setError('노티피케이션을 불러오는데 실패했습니다.')
        }
      } catch (err) {
        console.error('노티피케이션 조회 오류:', err)
        setError('노티피케이션을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

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
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#542BA8'
            }}>
              로딩 중...
            </div>
          ) : error ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#FF6B6B'
            }}>
              {error}
            </div>
          ) : (
            /* 알림 컴포넌트들을 map으로 반복 */
            notifications.map((notification) => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </div>
        
        {/* NotificationBottom */}
      </div>
    </div>
  )
}
