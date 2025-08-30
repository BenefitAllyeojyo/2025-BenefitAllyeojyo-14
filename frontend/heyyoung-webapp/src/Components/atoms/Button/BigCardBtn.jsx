import styles from './BigCardBtn.module.css'
import { icons } from '@/Icons'

export default function BigCardBtn({
  title, subtitle, distance, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.bigCardButton}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>
          {title}
        </h3>
        
        <div className={styles.subtitle}>
          <p className={styles.subtitleText}>{subtitle}</p>
          <p className={styles.distanceText}>{distance}</p>
        </div>
      </div>
      
      <img 
        src={icons.rightArrow} 
        alt="오른쪽 화살표"
        className={styles.arrow}
      />
    </button>
  )
}
