import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotificationItem.module.css'

export default function NotificationItem({ notification }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleGoToClick = async () => {
    try {
      setLoading(true)
      console.log('NotificationItem 클릭 - partnershipId:', notification.partnershipId || 1)
      
      // API 호출: /partnerships/{partnershipId}/branches
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
      const partnershipId = notification.partnershipId || 1
      const response = await fetch(`${API_BASE_URL}/partnerships/${partnershipId}/branches`, {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Branches API Response:', data)

      if (data.isSuccess && data.result) {
        const branchesData = data.result
        
        console.log('브랜치 데이터:', branchesData)
        console.log('브랜치 개수:', branchesData.length)
        
        // 브랜치 개수에 따라 다른 페이지로 이동
        if (branchesData.length > 1) {
          // 여러 개 브랜치 -> mapView로 이동
          console.log('여러 브랜치 - mapView로 이동')
          
          // 브랜치 데이터를 세션스토리지에 저장 (mapView에서 사용)
          sessionStorage.setItem('partnershipBranches', JSON.stringify(branchesData))
          
          navigate('/benefit-map')
        } else if (branchesData.length === 1) {
          // 단일 브랜치 -> /store-detail로 이동
          console.log('단일 브랜치 - /store-detail로 이동')
          
          // 브랜치 데이터를 세션스토리지에 저장
          sessionStorage.setItem('storeDetailData', JSON.stringify({
            partnershipBranchDto: branchesData[0]
          }))
          
          navigate('/store-detail')
        } else {
          // 브랜치가 없음
          console.log('브랜치가 없습니다')
          alert('해당 제휴처의 브랜치 정보를 찾을 수 없습니다.')
        }
      }
    } catch (error) {
      console.error('브랜치 정보 가져오기 실패:', error)
      alert('브랜치 정보를 가져오는데 실패했습니다.')
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
