import styles from './LongPurpleBtn.module.css'

export default function LongPurpleBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.longPurpleButton}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
