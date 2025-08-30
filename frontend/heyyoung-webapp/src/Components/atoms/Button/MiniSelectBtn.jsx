import { useState } from 'react'
import styles from './MiniSelectBtn.module.css'

export default function MiniSelectBtn({
  label, onClick, disabled = false, isSelected = false
}) {
  const [isHovered, setIsHovered] = useState(false)

  const buttonClasses = [
    styles.miniSelectButton,
    isSelected ? styles.selected : (isHovered && !disabled ? styles.hovered : styles.normal)
  ].join(' ')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={buttonClasses}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
