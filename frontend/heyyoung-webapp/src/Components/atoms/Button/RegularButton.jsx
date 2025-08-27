import styles from './RegularButton.module.css'

export default function RegularButton({
  label, onClick, disabled = false, white = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={white ? styles.whiteButton : styles.regularButton}
      label = {label}
    >
      <span className={ styles.label}>{label}</span>
    </button>
  )
}
