import React from 'react'
import styles from './ZoneBox.module.css'
import MiniPurpleBtn from '../../atoms/Button/MiniPurpleBtn'
import mapImage from '../../../assets/images/map.png'
import shopImage from '../../../assets/images/shop.png'

export default function ZoneBox({ 
  image = 'shop', // 'shop' 또는 'map'
  text = "실시간 추천 제휴 보기",
  buttonText = "조회하기",
  onClick
}) {
  const getImage = () => {
    switch(image) {
      case 'map':
        return mapImage
      case 'shop':
      default:
        return shopImage
    }
  }

  return (
    <div className={styles.zoneBox}>
      <img 
        src={getImage()} 
        alt="아이콘"
        className={styles.icon}
      />
      <div className={styles.text}>
        {text}
      </div>
      <MiniPurpleBtn 
        label={buttonText}
        onClick={onClick}
      />
    </div>
  )
}
