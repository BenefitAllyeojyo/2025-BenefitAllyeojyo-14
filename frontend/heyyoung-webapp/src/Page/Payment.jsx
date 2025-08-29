import { Button } from '@/Components/atoms/Button'

export default function Payment(){
  return (
    <main style={{ padding:'16px 0' }}>
      <h1 style={{ margin:0, fontSize:20, fontWeight:700 }}>결제</h1>
      <div style={{
        width:'min(80vw,320px)', aspectRatio:'1/1', background:'#F3F4F6',
        borderRadius:'12px', margin:'16px auto'
      }}/>
      <Button label="결제 바코드 생성" />
    </main>
  )
}
