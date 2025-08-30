import styles from './LongVioletBtn.module.css'

export default function LongVioletBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.longVioletButton}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
