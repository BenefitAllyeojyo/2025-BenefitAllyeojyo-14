import React from 'react'
import styles from './SavingBox.module.css'

export default function SavingBox({ 
  leftText = "이번달 아낀 금액", 
  rightText = "123,456,789원" 
}) {
  return (
    <div className={styles.savingBox}>
      <div className={styles.savingBoxContent}>
        <div className={styles.leftText}>
          {leftText}
        </div>
        <div className={styles.rightText}>
          {rightText}
        </div>
      </div>
    </div>
  )
}
