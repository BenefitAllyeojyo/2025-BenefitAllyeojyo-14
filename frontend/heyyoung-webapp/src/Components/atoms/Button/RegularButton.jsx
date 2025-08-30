import styles from './RegularButton.module.css'

export default function RegularButton({
  label, onClick, disabled = false, white = false
}) {
  const handleClick = (e) => {
    console.log('RegularButton 클릭됨:', label);
    if (onClick) {
      onClick(e);
    }
  };

  const handleTouchStart = (e) => {
    console.log('RegularButton 터치 시작:', label);
  };

  const handleTouchEnd = (e) => {
    console.log('RegularButton 터치 종료:', label);
    // 터치 종료 시에도 클릭 이벤트 발생
    handleClick(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      className={white ? styles.whiteButton : styles.regularButton}
      label={label}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
