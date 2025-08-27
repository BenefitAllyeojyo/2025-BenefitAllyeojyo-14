import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import styles from './QRCode.module.css'

export default function QRCodeComponent({ 
  qrData = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImFjY291bnROdW1iZXIiOiIwMDEwNTU3MjA4ODE3MzAxIiwiaWF0IjoxNzU2MjYzNzk4LCJleHAiOjE3NTYyNjQwOTh9.Ish-n9PduxN3M05wi70gQYJ3PKLq1jHP-TAY3lDqQ3E",
  size = 200 
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(qrData, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error('QR 코드 생성 실패:', error)
      }
    }

    generateQRCode()
  }, [qrData, size])

  return (
    <div className={styles.qrCodeContainer}>
      {qrCodeUrl ? (
        <img 
          src={qrCodeUrl}
          alt="QR Code"
          className={styles.qrCode}
          width={size}
          height={size}
        />
      ) : (
        <div className={styles.loading}>QR 코드 생성 중...</div>
      )}
    </div>
  )
}
