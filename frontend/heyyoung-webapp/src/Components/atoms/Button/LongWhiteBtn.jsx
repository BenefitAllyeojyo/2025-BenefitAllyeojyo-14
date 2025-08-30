import styles from './LongWhiteBtn.module.css'
import { icons } from '@/Icons'

export default function LongWhiteBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.longWhiteButton}
    >
      <span className={styles.label}>
        {label}
      </span>
      <img 
        src={icons.rightArrow} 
        alt="오른쪽 화살표"
        className={styles.arrow}
      />
    </button>
  )
}