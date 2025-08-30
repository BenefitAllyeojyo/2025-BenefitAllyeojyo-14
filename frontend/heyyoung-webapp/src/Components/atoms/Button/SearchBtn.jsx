import styles from './SearchBtn.module.css'
import { icons } from '@/Icons'

export default function SearchBtn({
  onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.searchButton}
    >
      <img 
        src={icons.send} 
        alt="전송 아이콘"
        className={styles.icon}
      />
    </button>
  )
}
