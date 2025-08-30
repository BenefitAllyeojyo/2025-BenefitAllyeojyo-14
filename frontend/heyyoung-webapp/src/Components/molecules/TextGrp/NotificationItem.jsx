import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotificationItem.module.css'

export default function NotificationItem({ notification }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleGoToClick = async () => {
    try {
      setLoading(true)
      
      // API 호출: /partnerships/{partnershipId} (파트너십 상세 정보)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
      const partnershipId = notification.partnershipId || 1
      const response = await fetch(`${API_BASE_URL}/partnerships/${partnershipId}`, {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.isSuccess && data.result) {
        // 파트너십 상세 데이터를 세션스토리지에 저장
        sessionStorage.setItem('storeDetailData', JSON.stringify(data.result))
        
        // store-detail 페이지로 이동
        navigate('/store-detail')
      } else {
        alert('파트너십 정보를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('파트너십 정보 조회 실패:', error)
      alert('파트너십 정보를 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.notificationItem}>
      {/* 왼쪽 흰색 원형 아이콘 */}
      <div className={styles.icon} />
      
      {/* 메인 텍스트 내용 */}
      <div className={styles.content}>
        <div className={styles.title}>
          {notification.title}
        </div>
        <div className={styles.subtitle}>
          {notification.subtitle}
        </div>
        {notification.description && (
          <div className={styles.description}>
            {notification.description}
          </div>
        )}
      </div>
      
      {/* 하단 "바로가기>" 버튼 */}
      <div className={styles.buttonContainer}>
        <span 
          className={styles.goToButton}
          onClick={handleGoToClick}
        >
          {loading ? '로딩 중...' : '바로가기 >'}
        </span>
      </div>
    </div>
  )
}
