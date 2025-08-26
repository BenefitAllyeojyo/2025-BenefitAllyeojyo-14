import React from 'react'
import styles from './PaymentGuide.module.css'
import MessageBubble from '../../atoms/Text/MessageBubble'
import solCameraImage from '../../../assets/images/character/SOL_Camera.png'

export default function PaymentGuide() {
  return (
    <div className={styles.paymentGuide}>
      <div className={styles.guideContainer}>
        <MessageBubble 
          text={`결제 시 QR코드를 직원분께 보여주세요!
                할인이 자동 적용된 상태로 결제됩니다!`}
        />
      </div>
      
      <div className={styles.characterContainer}>
        <img 
          src={solCameraImage} 
          alt="SOL Camera Character" 
          className={styles.characterImage}
        />
      </div>
    </div>
  )
}
