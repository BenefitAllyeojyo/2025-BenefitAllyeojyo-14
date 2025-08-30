import React, { useState, useEffect } from 'react'
import styles from './CountdownTimer.module.css'

export default function CountdownTimer({ 
  initialSeconds = 60,
  onTimeout 
}) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout?.()
      return
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds, onTimeout])

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${remainingSeconds}초 남았습니다`
  }

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.countdownText}>
        {formatTime(seconds)}
      </div>
    </div>
  )
}
