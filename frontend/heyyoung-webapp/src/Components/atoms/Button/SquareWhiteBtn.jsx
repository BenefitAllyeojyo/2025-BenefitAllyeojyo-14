import styles from './SquareWhiteBtn.module.css'

export default function SquareWhiteBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.squareWhiteButton}
    >
      <span className={styles.label}>
        {label}
      </span>
    </button>
  )
}
