import styles from './MiniTagBtn.module.css';

export default function MiniTagBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.MiniTagBtn}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
