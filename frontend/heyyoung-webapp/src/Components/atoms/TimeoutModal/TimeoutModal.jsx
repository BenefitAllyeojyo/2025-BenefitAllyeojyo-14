import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './TimeoutModal.module.css'

export default function TimeoutModal({ 
  isOpen, 
  onClose 
}) {
  const navigate = useNavigate()

  const handleBackClick = () => {
    onClose?.()
    navigate(-1) // 이전 페이지로 이동
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>시간 만료</h3>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>
            QR 코드의 유효 시간이 만료되었습니다.
          </p>
          <p className={styles.modalSubMessage}>
            다시 시도해주세요.
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.backButton}
            onClick={handleBackClick}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  )
}
