# 폴더 트리(주석 포함)

```

src/
├─ Assets/         # 이미지/폰트/더미 JSON 같은 정적 리소스
├─ Icons/          # SVG 아이콘 모음 (index.js 하나로 매핑)
├─ Components/     # 재사용 UI (atoms → molecules → organisms → layout)
├─ Page/           # 라우트 화면 (조립만, 데이터는 밖에서)
├─ Redux/          # RTK 슬라이스(도메인 상태)
├─ Store/          # configureStore (슬라이스 합치기)
├─ Style/          # 디자인 토큰(CSS 변수) + 글로벌 스타일
├─ hooks/          # 재사용 로직(패칭/무한스크롤/폼 등)
├─ lib/            # API/유틸/포맷터 (순수 함수, UI 몰라야 함)
├─ App.jsx         # 앱 루트
├─ main.jsx        # 엔트리(Provider/Router/AppShell 마운트)
└─ jsconfig.json   # "@/..." 별칭


```

```
src/
├─ Assets/                       # 정적 리소스(빌드시 경로 고정): 이미지·폰트·더미 JSON 등
│  ├─ images/                    # PNG/JPG/WebP. 컴포넌트에서 직접 import하여 사용
│  └─ fonts/                     # 웹폰트 파일(.woff2). CSS @font-face는 Style/globals.css에서 선언
│
├─ Icons/                        # SVG 아이콘 전용 계층(스프라이트/인라인 관리 일원화)
│  ├─ svg/                       # 원본 SVG 파일들 (24px 그리드 기준, stroke=1.5)
│  └─ index.js                   # 아이콘 매퍼(아이콘 이름→경로). 컴포넌트는 여기만 import
│
├─ Components/                   # UI 컴포넌트(재사용 단위). atomic 계층으로 분리
│  ├─ atoms/                     # 최소 단위(Button, Chip, Input, Spinner, Skeleton 등)
│  │  └─ Button/
│  │     ├─ Button.jsx          # 컴포넌트 본체(표현만 담당, 데이터 패칭 금지)
│  │     └─ index.js            # 배럴(export { Button } from './Button')
│  ├─ molecules/                 # 작은 조합(BenefitCard, FilterBar, SortDropdown 등)
│  ├─ organisms/                 # 섹션 단위(BenefitList, BottomSheet, BottomNav 등)
│  └─ layout/                    # 레이아웃/AppShell/헤더·푸터 등 페이지 공통 레이아웃
│
├─ Page/                         # 라우트(화면). 오직 조립·플로우만, 로직은 hooks/Redux로
│  ├─ BenefitsHome.jsx
│  ├─ Payment.jsx
│  └─ NotFound.jsx
│
├─ Redux/                        # RTK slices(도메인 상태)와 action 로직
│  └─ slices/
│     ├─ benefitsSlice.js        # 혜택 목록/페이지네이션/로딩·에러
│     └─ uiSlice.js              # UI 상태(모달 열림 등, 서버 비의존)
│
├─ Store/
│  └─ store.js                   # configureStore. slices만 결합(미들웨어 커스텀도 여기)
│
├─ Style/
│  ├─ tokens.css                 # 디자인 토큰(CSS 변수: 색/라운드/간격/그림자) — 하드코딩 금지
│  └─ globals.css                # 리셋/글로벌 규칙(@font-face, base 스타일, 유틸 클래스)
│
├─ hooks/                        # 재사용 훅(데이터 패칭·무한스크롤·폼 등). UI는 절대 포함 X
│  └─ useOnEndReached.js
│
├─ lib/                          # API/유틸/포맷터(순수 함수). 전역 상태 의존 금지
│  └─ api.js
│
├─ App.jsx                       # 앱 루트(라우터 바인딩은 main.jsx에서)
├─ main.jsx                      # 엔트리(Provider/Router/AppShell 마운트)
└─ jsconfig.json                 # 경로 별칭 "@/..." 설정

```

## 네이밍/코드 스타일 규칙

- 컴포넌트/페이지: PascalCase (BenefitCard.jsx, BenefitsHome.jsx)

- 훅: camelCase + use 접두(useOnEndReached.js)

- 슬라이스: camelCase + Slice 접미(benefitsSlice.js)

- 액션: sliceName/actionName(RTK 기본 네임스페이스)

- 아이콘 키: kebab-case (bookmark, cafe)

- 경로 별칭: 항상 @/ 사용. 상위 경로 ../../.. 금지.

---

## 폴더별 상세 규칙

### 1) Assets/

넣는 것: PNG/JPG/WebP, 폰트(woff2), 더미 JSON.

하지 말 것: JS/컴포넌트 import. (단방향: “파일만 제공”)

사용 예시

```
import cafeThumb from '@/Assets/images/cafe.webp';
<img src={cafeThumb} alt="" />
```

### 2) Icons/

넣는 것: 24x24 SVG들(Icons/svg/\*.svg)

룰: stroke=1.5, fill="none" 권장. 항상 Icons/index.js를 통해 임포트.

시작 파일: Icons/index.js

- **새 아이콘 추가 순서**: `svg/`에 파일 추가 → `index.js`에 키 등록 → 컴포넌트에서 키로 사용.

```
import bookmark from '@/Icons/svg/bookmark.svg';
import cafe from '@/Icons/svg/cafe.svg';
export const icons = { bookmark, cafe };
```

시작 파일: Icons/index.js

```
import { icons } from '@/Icons';
<img src={icons.bookmark} alt="" width="20" height="20" />
```

### 3) Components/

- 요약

  - atoms → molecules → organisms → layout 방향으로만 의존 (거꾸로 금지)

  - 데이터 패칭/Redux 접근 금지(props만 받는 표현 컴포넌트)

  - 폭은 기본 width:100%, 텍스트는 .truncate/.line-clamp-2, 이미지 aspect-ratio

---

- **계층 규칙**: atoms → molecules → organisms → layout 순서로만 **의존 가능**.
  (역참조·사이클 금지: organisms가 atoms를 참조하는 건 OK, atoms가 organisms를 참조하면 **NO**)
- **파일 규칙**: **폴더 1개 = 컴포넌트 1개**. `ComponentName.jsx` + `index.js`(배럴).
- **표현 컴포넌트 원칙**:
  - 데이터 패칭/Redux 접근 **금지**. **props만** 받아 렌더.
  - 로딩/빈/오류는 **organisms**에서 처리(atoms/molecules에 에러 UI 박지 말기).
- **스타일 규칙**: **tokens.css 변수**만 사용(HEX/px 하드코딩 금지).
  - px 허용 범위: **패딩/갭/보더/라운드/아이콘 크기/버튼 높이** 등 고정 인터랙션.
  - 폭은 기본 `width: 100%`, 텍스트 영역엔 `min-width: 0` + `truncate/line-clamp`.
- **접근성**:
  - 인터랙션 요소는 항상 역할과 이름(라벨) 부여.
  - 로딩 상태에 `aria-busy`, 모달은 `role="dialog"` + 포커스 트랩.

4-1) atoms 예시: Button

```
// Components/atoms/Button/Button.jsx
export default function Button({ label, tone='primary', size='md', state='default', onClick }) {
  const toneStyle = {
    primary:{ background:'var(--color-brand-500)', color:'#fff' },
    neutral:{ background:'#E5E7EB', color:'var(--color-text)' },
    danger: { background:'#E11D48', color:'#fff' },
  }[tone];
  const sizeStyle = { sm:{height:36,padding:'0 12px'}, md:{height:44,padding:'0 16px'}, lg:{height:52,padding:'0 20px'} }[size];
  const disabled = state==='disabled' || state==='loading';
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-busy={state==='loading'}
      style={{ ...toneStyle, ...sizeStyle, border:'none', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-1)', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, cursor:disabled?'default':'pointer' }}>
      <span className="truncate">{state==='loading' ? '처리 중…' : label}</span>
    </button>
  );
}
// Components/atoms/Button/index.js
export { default as Button } from './Button';

```


4-2) molecules 예시: BenefitCard
```
// Components/molecules/BenefitCard/BenefitCard.jsx
import { icons } from '@/Icons';
export default function BenefitCard({ title, discountText, distanceText, tags=[], thumbnail, bookmarked=false, onSelect }) {
  return (
    <article role="button" onClick={onSelect}
      style={{ width:'100%', display:'grid', gridTemplateColumns:'72px 1fr', gap:12, padding:12, borderRadius:'var(--radius-lg)', background:'var(--color-surface)', boxShadow:'var(--shadow-1)' }}>
      <div style={{ width:72, height:72, overflow:'hidden', borderRadius:12, background:'#E5E7EB' }}>
        {thumbnail && <img src={thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <h3 className="truncate" style={{ margin:0, fontSize:16, fontWeight:600 }}>{title}</h3>
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
  );
}

```

4-3) organisms 예시: BenefitList

```
// Components/organisms/BenefitList/BenefitList.jsx
import BenefitCard from '@/Components/molecules/BenefitCard/BenefitCard';
export default function BenefitList({ items, isLoading, isError, onRetry, onEndRef }) {
  return (
    <section style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {isError && <div style={{ padding:12, borderRadius:12, background:'#FEE2E2' }}>연결 오류 <button onClick={onRetry}>다시</button></div>}
      {!items.length && isLoading && [...Array(3)].map((_,i)=>(
        <div key={i} style={{ height:80, borderRadius:12, background:'#E5E7EB' }} />
      ))}
      {items.map(it=>(
        <BenefitCard key={it.id} title={it.title} discountText={it.discount} distanceText={it.distance} tags={it.tags} thumbnail={it.thumbnail} />
      ))}
      <div ref={onEndRef} style={{ height:8 }} />
    </section>
  );
}
```

4-4) layout 예시: AppShell 컨테이너 폭 고정
```
// Components/layout/AppShell.jsx
export default function AppShell({ children }) {
  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)' }}>
      <div id="app" style={{ width:'min(100vw,420px)', minWidth:320, margin:'0 auto', paddingInline:16, paddingBottom:'calc(16px + env(safe-area-inset-bottom))' }}>
        {children}
      </div>
    </div>
  );
}

```


### 4) Page/

- **페이지는 조립만**: 컴포넌트 배치, 훅 호출, Redux dispatch/select.
- 파일명은 **PascalCase**(컴포넌트처럼) 사용을 유지(네 구조와 일관성).
- URL → 파일 매핑은 **단방향**. 페이지가 다른 페이지를 직접 import하지 않음.

### 5) Redux/

- **Slice 1개 = 도메인 1개**. 상태, reducers, thunks를 **한 파일**에 응집.
- **비동기**는 `createAsyncThunk` 사용. API 호출은 **lib/api.js**로 위임.
- **UI 관련 상태**(모달 열림/정렬 키 등)는 `uiSlice` 고정. 서버 데이터와 **혼합 금지**.
- **Selector 규칙**: 페이지/훅에서 `useSelector`로 꺼내 쓰고, 컴포넌트로 **props로만 전달**.

### 6) Store/

- RTK `configureStore`만 위치. **미들웨어/DevTools** 설정도 여기서.
- Store는 **main.jsx**에서 `<Provider store={store}>`.

### 7) Style/

넣는 것: tokens.css(색/간격/라운드/그림자), globals.css(리셋/유틸).

룰: HEX/px를 컴포넌트에 직접 작성하지 말고 Style에서 정의한 토큰만 사용.

- **tokens.css**: 피그마 Variables/Styles 대응(색/간격/라운드/그림자).
  - 예: `-color-brand-500`, `-radius-lg`, `-space-16`, `-shadow-1`

```
/* tokens.css */
:root{
  --color-brand-500:#5B6CFF; --color-brand-600:#3D4DE6;
  --color-bg:#F5F6FA; --color-surface:#FFFFFF;
  --color-text:#111827; --color-text-muted:#6B7280;
  --radius-lg:16px; --shadow-1:0 1px 3px rgba(17,24,39,.08), 0 1px 2px rgba(17,24,39,.06);
}
@media (prefers-color-scheme: dark){ :root{ --color-bg:#0F1218; --color-surface:#0B0D12; --color-text:#E5E7EB; } }
```

- **globals.css**: 리셋, 기본 폰트, 유틸 클래스(예: `.line-clamp-2`).

```
/* globals.css */
*{box-sizing:border-box} html,body,#root{height:100%}
body{margin:0;background:var(--color-bg);color:var(--color-text);font-family:system-ui,-apple-system,"Segoe UI",Roboto}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}


```

### 8) hooks/
재사용 로직 넣는 곳

  ex) 무한 스크롤
```
// hooks/useOnEndReached.js
import { useEffect, useRef } from 'react';
export default function useOnEndReached(callback, rootMargin='400px') {
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver(([e])=>{ if(e.isIntersecting) callback(); },{ rootMargin });
    io.observe(el); return ()=>io.disconnect();
  },[callback, rootMargin]);
  return ref;
}


```


### 9) lib/

- **순수 함수/클라이언트**만. Redux/React import **금지**.
- 공통 포맷터(가격, 거리, 날짜)도 여기에.

---

## 네이밍/코드 스타일 규칙

- **컴포넌트/페이지**: PascalCase (`BenefitCard.jsx`, `BenefitsHome.jsx`)
- **훅**: camelCase + `use` 접두(`useOnEndReached.js`)
- **슬라이스**: camelCase + `Slice` 접미(`benefitsSlice.js`)
- **액션**: `sliceName/actionName`(RTK 기본 네임스페이스)
- **아이콘 키**: `kebab-case` (`bookmark`, `cafe`)
- **경로 별칭**: 항상 `@/` 사용. 상위 경로 `../../..` 금지.

예시 import:

```jsx
jsx
코드 복사
import { BenefitCard } from '@/Components/molecules/BenefitCard';
import useOnEndReached from '@/hooks/useOnEndReached';
import { fetchBenefits } from '@/Redux/slices/benefitsSlice';

```

---

## 의존성 방향(중요)

```
swift
코드 복사
Assets   → (누구에게도 의존 X)
Icons    → Components, Page
Style    → 모든 UI에서 읽기(단, 순환 없음)

hooks    → Page, Components(organisms에서만 호출 권장)
lib      → hooks, Redux, Page (UI 비의존)

Redux    → Page (Components는 Redux 직접 접근 금지)
Store    → main.jsx (Provider)

Components(Atoms)     → (아무것도 의존 X, 단 Style/Icons/Assets는 OK)
Components(Molecules) → Atoms(+ Icons/Assets)
Components(Organisms) → Molecules/Atoms(+ hooks)
Page                   → Components/Redux/hooks/lib

```

순환 의존 발견 시 즉시 분리(특히 Components ↔ Page ↔ Redux 간).

---

## 컴포넌트 템플릿(복붙용)

**Atoms 템플릿**

```jsx
jsx
코드 복사
// Components/atoms/MyAtom/MyAtom.jsx
export default function MyAtom({ label, onClick }) {
  return (
    <buttontype="button"
      onClick={onClick}
      style={{
        height: 44, padding: '0 16px',
        background: 'var(--color-brand-500)', color: '#fff',
        border: 'none', borderRadius: 'var(--radius-lg)',
      }}
    >
      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {label}
      </span>
    </button>
  );
}
// Components/atoms/MyAtom/index.js
export { default as MyAtom } from './MyAtom';

```

**Molecules 템플릿**

```jsx
jsx
코드 복사
// Components/molecules/MyCard/MyCard.jsx
export default function MyCard({ title, desc, icon }) {
  return (
    <article style={{
      width:'100%', display:'grid', gridTemplateColumns:'56px 1fr', gap:12,
      padding:12, borderRadius:'var(--radius-lg)', background:'#fff', boxShadow:'var(--shadow-1)'
    }}>
      <div style={{ width:56, height:56, borderRadius:12, background:'#E5E7EB' }}>{icon}</div>
      <div style={{ minWidth:0 }}>
        <h3 style={{ margin:0, fontSize:16, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</h3>
        <p style={{ margin:'4px 0 0', color:'var(--color-text-muted)', fontSize:14 }} className="line-clamp-2">{desc}</p>
      </div>
    </article>
  );
}
// Components/molecules/MyCard/index.js
export { default as MyCard } from './MyCard';

```

---

## Redux 운용 규칙(실전)

- **초기 상태는 최소**: `items`, `loading`, `error`, `page` 정도로 단순하게.
- **서버 데이터는 slice 하나에 집중**. UI 정렬 키 등은 `uiSlice`로 분리.
- **Thunk**는 lib API만 호출하고, **데이터 정규화**는 slice에서(또는 lib에서 순수하게).
- **컴포넌트는 Redux 모름**: 페이지에서 `useSelector`로 데이터를 꺼내고 **props로 넘김**.

---

## 스타일/토큰 규칙(깨짐 방지 요약)

- **컨테이너만 고정폭**: AppShell에서 `width: min(100vw, 420px); min-width:320px;`
- **카드/폼/버튼 폭**: `width: 100%` 기본. 고정 금지.
- **텍스트**: 제목 `truncate`, 설명 `line-clamp-2`, 긴 단어 `overflow-wrap:anywhere`.
- **이미지**: `aspect-ratio: 1/1` + `object-fit: cover`.
- **바텀시트**: `height: clamp(320px, 85dvh, 700px)` + Safe Area 패딩.

---

## 마지막 체크리스트(이 구조가 잘 굴러가려면)

- [ ] **Page는 조립만** 하고, 데이터는 hooks/Redux에서 → Components엔 props로만 전달
- [ ] **Components는 표현만**, fetch/dispatch 직접 호출 금지
- [ ] **토큰 100% 사용**(HEX/px 하드코딩 0)
- [ ] **의존 방향**(atoms→molecules→organisms→layout→Page) 위반 없음
- [ ] **Icons는 index.js만** import(원본 SVG 직접 import 금지)
- [ ] 바깥은 고정폭, 안은 유연 레이아웃(`w:100%`, `min-w:0`, `clamp`, `aspect-ratio`)
