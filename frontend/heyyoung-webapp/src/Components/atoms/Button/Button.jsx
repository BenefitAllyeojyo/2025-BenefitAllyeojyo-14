import styles from './Button.module.css'

export default function Button({
  label, tone='primary', size='md', state='default',
  leadingIcon, trailingIcon, onClick
}) {
  const disabled = state==='disabled' || state==='loading'
  
  const buttonClasses = [
    styles.button,
    styles[tone],
    styles[size]
  ].join(' ')

  return (
    <button
      type="button" 
      onClick={onClick} 
      disabled={disabled} 
      aria-busy={state==='loading'}
      className={buttonClasses}
    >
      {leadingIcon ? <span aria-hidden className={styles.icon}>{leadingIcon}</span> : null}
      <span className={styles.label}>{state==='loading' ? '처리 중…' : label}</span>
      {trailingIcon ? <span aria-hidden className={styles.icon}>{trailingIcon}</span> : null}
    </button>
  )
}
