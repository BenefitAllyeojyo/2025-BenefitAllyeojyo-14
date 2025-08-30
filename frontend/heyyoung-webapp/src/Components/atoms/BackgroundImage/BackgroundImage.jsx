export default function BackgroundImage({ 
  src, 
  alt = "배경 이미지", 
  children,
  overlayOpacity = 0 
}) {
  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',           // 가로 100%
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* 배경 이미지 */}
      <img 
        src={src}
        alt={alt}
        style={{
          width: '100%',           
          height: 'auto',          
          display: 'block',        
          objectFit: 'cover',     
          objectPosition: 'top center',
          zIndex: 0
        }}
      />
      
      {/* 컨텐츠는 absolute positioning */}
      <div 
        style={{
          position: 'absolute',    // relative → absolute
          top: 0,
          left: 0,
          zIndex: 2,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  )
}