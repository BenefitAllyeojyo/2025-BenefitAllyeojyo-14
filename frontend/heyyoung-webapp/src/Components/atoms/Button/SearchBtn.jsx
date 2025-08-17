export default function SearchBtn({
  onClick, disabled = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        width: '32px',
        height: '32px',
        padding: '13px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '100%',
        background: 'var(--Highlight-BackGround)',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="12" 
        height="12" 
        viewBox="0 0 12 12" 
        fill="none"
        style={{
          width: '12px',
          height: '12px',
          flexShrink: 0
        }}
      >
        <mask id="mask0_3801_17929" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
          <path d="M0.411731 4.22018C0.345141 4.24237 0.286115 4.2828 0.241367 4.33688C0.196619 4.39095 0.167945 4.4565 0.158607 4.52606C0.149269 4.59563 0.159642 4.66642 0.188546 4.73038C0.21745 4.79434 0.263724 4.84891 0.322105 4.88787L3.63826 6.71592C3.70007 6.74997 3.77023 6.7659 3.84068 6.76187C3.91114 6.75783 3.97902 6.734 4.03654 6.69311L7.55952 4.18094C7.72976 4.06692 7.9334 4.27056 7.81938 4.4408L5.30721 7.96378C5.26632 8.0213 5.24249 8.08918 5.23845 8.15964C5.23442 8.23009 5.25034 8.30025 5.2844 8.36206L7.11245 11.6782C7.15141 11.7366 7.20598 11.7829 7.26994 11.8118C7.3339 11.8407 7.40469 11.8511 7.47426 11.8417C7.54382 11.8324 7.60937 11.8037 7.66344 11.759C7.71752 11.7142 7.75795 11.6552 7.78014 11.5886L11.2273 1.24715C11.2492 1.18112 11.2524 1.11029 11.2363 1.04258C11.2203 0.974863 11.1858 0.912943 11.1366 0.863741C11.0874 0.81454 11.0255 0.779998 10.9577 0.763979C10.89 0.74796 10.8192 0.751096 10.7532 0.773037L0.411731 4.22018Z" fill="white"/>
        </mask>
        <g mask="url(#mask0_3801_17929)">
          <rect width="12" height="12" fill="white"/>
        </g>
      </svg>
    </button>
  )
}
