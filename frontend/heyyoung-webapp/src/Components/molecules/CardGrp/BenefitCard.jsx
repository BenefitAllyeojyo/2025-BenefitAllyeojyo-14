import { icons } from '@/Icons'

export default function BenefitCard({
  title, discountText, distanceText, tags=[], thumbnail, bookmarked=false, onSelect
}) {
  return (
    <article
      role="button" onClick={onSelect}
      style={{
        width:'100%', display:'grid', gridTemplateColumns:'72px 1fr',
        gap:12, padding:12, borderRadius:'var(--radius-lg)',
        background:'var(--color-surface)', boxShadow:'var(--shadow-1)'
      }}
    >
      <div style={{ width:72, height:72, overflow:'hidden', borderRadius:12, background:'#E5E7EB' }}>
        {thumbnail && <img src={thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:600 }} className="truncate">{title}</h3>
          {bookmarked && <img src={icons.bookmark} alt="" width="16" height="16" aria-hidden />}
        </div>
        {discountText && <p style={{ margin:'4px 0 0', color:'var(--color-brand-600)', fontSize:14 }}>{discountText}</p>}
        {distanceText && <p style={{ margin:'2px 0 0', color:'var(--color-text-muted)', fontSize:12 }}>{distanceText}</p>}
        {!!tags.length && (
          <div style={{ marginTop:4, display:'flex', flexWrap:'wrap', gap:4 }}>
            {tags.slice(0,4).map(t=>(
              <span key={t} style={{ padding:'2px 8px', fontSize:11, borderRadius:999, background:'#F3F4F6', color:'#374151' }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
