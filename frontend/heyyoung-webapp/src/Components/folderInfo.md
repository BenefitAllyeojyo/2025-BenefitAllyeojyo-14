
# Components/      
###UI 컴포넌트(재사용 단위). atomic 계층으로 분리

- 요약

  - atoms → molecules → organisms → layout 방향으로만 의존 (거꾸로 금지)

  - 데이터 패칭/Redux 접근 금지(props만 받는 표현 컴포넌트)

  - 폭은 기본 width:100%, 텍스트는 .truncate/.line-clamp-2, 이미지 aspect-ratio


### 폴더 구조
```
src/
├─ Components/  # UI 컴포넌트(재사용 단위) atomic 계층으로 분리
│  ├─ atoms/    # 최소 단위
│  │  └─ Button/
│  │     ├─ Button.jsx   # 컴포넌트 본체
│  │     └─ index.js   # 배럴
│  ├─ molecules/    # 작은 조합
│  ├─ organisms/   # 섹션 단위
│  └─ layout/      # 레이아웃/AppShell/헤더·푸터 등 페이지 공통 레이아웃
│  │  └─ AppShell.jsx/ # 고정 폭 설정해주는 컨테이너

```


### Components/

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


### 하위 폴더

- atoms/    # 최소 단위(Button, Chip, Input, Spinner, Skeleton 등)
    - Button/
        - Button.jsx   # 컴포넌트 본체(표현만 담당, 데이터 패칭 금지)
        - index.js     # 배럴(export { Button } from './Button')
- molecules/           # 작은 조합(BenefitCard, FilterBar, SortDropdown 등)
- organisms/   # 섹션 단위(BenefitList, BottomSheet, BottomNav 등)
- layout/           # 레이아웃/AppShell/헤더·푸터 등 페이지 공통 레이아웃
    -  AppShell.jsx/ # 고정 폭 설정해주는 컨테이너
