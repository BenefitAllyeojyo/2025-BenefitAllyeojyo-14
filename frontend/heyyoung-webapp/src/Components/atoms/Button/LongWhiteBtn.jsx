import styles from './LongWhiteBtn.module.css'

export default function LongWhiteBtn({
  label, onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.longWhiteButton}
    >
      <span className={styles.label}>
        {label}
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="12" 
        height="13" 
        viewBox="0 0 12 13" 
        fill="none"
        className={styles.arrow}
      >
        <mask id="mask0_3817_3648" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="2" y="0" width="8" height="13">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.72604 0.969661C2.42502 1.26254 2.42502 1.7374 2.72604 2.03028L7.31979 6.49978L2.72604 10.9693C2.42502 11.2622 2.42502 11.737 2.72604 12.0299C3.02707 12.3228 3.51512 12.3228 3.81615 12.0299L9.5 6.49978L3.81615 0.969661C3.51512 0.67678 3.02707 0.67678 2.72604 0.969661Z" fill="#542BA8"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M2.72604 0.969661C2.42502 1.26254 2.42502 1.7374 2.72604 2.03028L7.31979 6.49978L2.72604 10.9693C2.42502 11.2622 2.42502 11.737 2.72604 12.0299C3.02707 12.3228 3.51512 12.3228 3.81615 12.0299L9.5 6.49978L3.81615 0.969661C3.51512 0.67678 3.02707 0.67678 2.72604 0.969661Z" fill="black" fillOpacity="0.2"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M2.72604 0.969661C2.42502 1.26254 2.42502 1.7374 2.72604 2.03028L7.31979 6.49978L2.72604 10.9693C2.42502 11.2622 2.42502 11.737 2.72604 12.0299C3.02707 12.3228 3.51512 12.3228 3.81615 12.0299L9.5 6.49978L3.81615 0.969661C3.51512 0.67678 3.02707 0.67678 2.72604 0.969661Z" fill="black" fillOpacity="0.2"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M2.72604 0.969661C2.42502 1.26254 2.42502 1.7374 2.72604 2.03028L7.31979 6.49978L2.72604 10.9693C2.42502 11.2622 2.42502 11.737 2.72604 12.0299C3.02707 12.3228 3.51512 12.3228 3.81615 12.0299L9.5 6.49978L3.81615 0.969661C3.51512 0.67678 3.02707 0.67678 2.72604 0.969661Z" fill="black" fillOpacity="0.2"/>
        </mask>
        <g mask="url(#mask0_3817_3648)">
          <rect x="0.000244141" y="0.5" width="11.9995" height="11.9995" fill="#542BA8"/>
          <rect x="0.000244141" y="0.5" width="11.9995" height="11.9995" fill="black" fillOpacity="0.2"/>
          <rect x="0.000244141" y="0.5" width="11.9995" height="11.9995" fill="black" fillOpacity="0.2"/>
          <rect x="0.000244141" y="0.5" width="11.9995" height="11.9995" fill="black" fillOpacity="0.2"/>
        </g>
      </svg>
    </button>
  )
}
