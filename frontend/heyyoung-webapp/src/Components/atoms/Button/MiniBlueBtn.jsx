import styles from './MiniBlueBtn.module.css'

export default function MiniBlueBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.miniBlueButton}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
