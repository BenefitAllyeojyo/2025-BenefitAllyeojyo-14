import styles from './CharacterBtn.module.css'

export default function CharacterBtn({
  imageUrl, onClick, disabled = false, alt = "캐릭터"
}) {
  const buttonClasses = [
    styles.characterButton,
    imageUrl ? styles.hasImage : styles.noImage
  ].join(' ')

  const buttonStyle = imageUrl 
    ? { backgroundImage: `url(${imageUrl})` }
    : {}

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={buttonStyle}
    >
      {!imageUrl && '🐱'}
    </button>
  )
}