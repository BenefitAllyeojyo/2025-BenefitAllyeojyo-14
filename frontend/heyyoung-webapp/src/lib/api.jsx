// src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE || '';

export async function getJSON(path) {
  // API 베이스 미설정 + /api/benefits 로 시작 → 목(더미데이터)으로 대체
  if (import.meta.env.DEV && !BASE && path.startsWith('/api/benefits')) {
    const r = await fetch('/mock/benefits.json', { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`Mock HTTP ${r.status}`);
    return r.json();
  }

  // 서버 완료시 (실서버)
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`HTTP ${r.status} ${r.statusText} ${text}`.trim());
  }
  return r.json();
}
