import React from 'react'
import styles from './HeadTextModule.module.css'

export default function HeadTextModule({ title = "결제 완료" }) {
  return (
    <div className={styles.headTextModule}>
      <div className={styles.title}>{title}</div>
    </div>
  )
}
