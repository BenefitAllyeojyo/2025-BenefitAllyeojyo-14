import React from 'react';
import styles from './MapActionButton.module.css';

/**
 * 지도 액션 버튼 컴포넌트
 * @param {Object} props
 * @param {string} props.icon - 버튼에 표시할 아이콘 (이모지)
 * @param {string} props.title - 버튼 툴팁 텍스트
 * @param {Function} props.onClick - 클릭 시 실행할 함수
 * @param {boolean} props.disabled - 버튼 비활성화 여부
 * @param {string} props.variant - 버튼 스타일 변형 ('default', 'loading', 'error')
 * @param {string} props.position - 버튼 위치 ('top', 'bottom')
 * @param {string} props.className - 추가 CSS 클래스
 */
const MapActionButton = ({
  icon = '📍',
  title = '버튼',
  onClick,
  disabled = false,
  variant = 'default',
  position = 'bottom',
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.mapActionButton,
    styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`],
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {icon}
    </button>
  );
};

export default MapActionButton;
