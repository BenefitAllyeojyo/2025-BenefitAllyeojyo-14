import React from 'react'

export default function NotificationItem({ notification }) {
  return (
    <div style={{
      backgroundColor: '#EFF0FC',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      {/* 왼쪽 흰색 원형 아이콘 */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        width: '24px',
        height: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '50%'
      }} />
      
      {/* 메인 텍스트 내용 */}
      <div style={{
        marginLeft: '48px',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1A1A1A',
          marginBottom: '4px'
        }}>
          {notification.title}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666666',
          marginBottom: '4px'
        }}>
          {notification.subtitle}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666666'
        }}>
          {notification.description}
        </div>
      </div>
      
      {/* 하단 "바로가기>" 버튼 */}
      <div style={{
        textAlign: 'right'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#542BA8',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          바로가기>
        </span>
      </div>
    </div>
  )
}
