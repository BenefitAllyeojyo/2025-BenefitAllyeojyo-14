import React from 'react'
import styles from './PayTimeModule.module.css'

export default function PayTimeModule({ time = "2024.01.15 14:30" }) {
  return (
    <div className={styles.payTimeModule}>
      <div className={styles.time}>{time}</div>
    </div>
  )
}
