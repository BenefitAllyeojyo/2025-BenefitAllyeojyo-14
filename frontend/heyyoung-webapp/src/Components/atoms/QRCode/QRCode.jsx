import React from 'react'
import styles from './QRCode.module.css'

export default function QRCode({ 
  qrData = "https://example.com/payment",
  size = 200 
}) {
  // QR 코드 생성 함수 (간단한 구현)
  const generateQRCode = (data) => {
    // 실제로는 qrcode 라이브러리를 사용해야 합니다
    // 현재는 임시로 검은색 사각형으로 대체
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="black"/>
      </svg>
    `)}`
  }

  return (
    <div className={styles.qrCodeContainer}>
      <img 
        src={generateQRCode(qrData)}
        alt="QR Code"
        className={styles.qrCode}
        width={size}
        height={size}
      />
    </div>
  )
}
