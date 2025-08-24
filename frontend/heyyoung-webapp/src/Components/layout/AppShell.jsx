export default function AppShell({ children }) {
  return (
    <div style={{ 
      height:'100vh', 
      background:'var(--color-bg)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px 0'
    }}>
      <div
        id="app"
        style={{
          width:'375px', 
          height:'812px',
          background: 'white',
          position: 'relative',
          overflow: 'hidden',
          overflowY: 'auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)'
        }}
      >
        {children}
      </div>
    </div>
  )
}
