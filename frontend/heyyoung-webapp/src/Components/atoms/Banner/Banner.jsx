export default function Banner({
  title = "배너 제목",
  subtitle = "배너 부제목",
  width = "200px",
  height = "200px",
  backgroundColor = "rgba(128, 128, 128, 0.3)", // 투명한 회색
  background, // gradient 배경을 위한 prop
  borderRadius = "16px",
  onClick,
  style = {}
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width,
        height,
        background: background || backgroundColor, // background가 있으면 사용, 없으면 backgroundColor 사용
        borderRadius,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style
      }}
      onMouseDown={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(0.98)'
        }
      }}
      onMouseUp={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
    >
      {/* 배너 제목 */}
      <h3 style={{
        margin: 0,
        marginBottom: '8px',
        color: 'var(--neutral-dark-darkest)',
        fontSize: 'var(--font-size-h4)',
        fontWeight: 'var(--font-weight-heading)',
        textAlign: 'center'
      }}>
        {title}
      </h3>
      
      {/* 배너 부제목 */}
      <p style={{
        margin: 0,
        color: 'var(--neutral-dark-light)',
        fontSize: 'var(--font-size-s)',
        fontWeight: 'var(--font-weight-body)',
        textAlign: 'center'
      }}>
        {subtitle}
      </p>
    </div>
  )
}
