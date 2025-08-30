import React from 'react'
import styles from './PayPersonalInfo.module.css'
import rinoFaceImage from '../../../assets/images/character/RINO_Face.png'

export default function PayPersonalInfo({ 
  userName = "김신한 (20257727)",
  userInfo = "싸피대학교, 재학생 1학년"
}) {
  return (
    <div className={styles.payPersonalInfo}>
      <div className={styles.smallBar}></div>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.userName}>{userName}</div>
          <div className={styles.userInfo}>{userInfo}</div>
        </div>
        
        <div className={styles.profileContainer}>
          <div className={styles.profileFrame}>
            <img 
              src={rinoFaceImage} 
              alt="RINO 캐릭터" 
              className={styles.profileImage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
