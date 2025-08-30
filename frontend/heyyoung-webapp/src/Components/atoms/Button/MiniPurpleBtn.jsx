import styles from './MiniPurpleBtn.module.css'

export default function MiniPurpleBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.miniPurpleButton}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
