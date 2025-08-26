import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PayHeadButton.module.css'
import leftArrowIcon from '../../../Icons/svg/leftArrow.svg'

export default function PayHeadButton({ 
  subtitle = "오늘 - Aug 15",
  onBackClick 
}) {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1) // 이전 페이지로 이동
    }
  }

  return (
    <div className={styles.payHeadButton}>
      <button
        type="button"
        onClick={handleBackClick}
        className={styles.leftArrowButton}
      >
        <img 
          src={leftArrowIcon} 
          alt="뒤로 가기"
          className={styles.leftArrow}
        />
      </button>
      
      <div className={styles.content}>
        <h3 className={styles.title}>
          헤이영 Pay 결제
        </h3>
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
