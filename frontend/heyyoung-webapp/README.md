# 헤이영 웹앱 (heyyoung-webapp)

대학생들을 위한 혜택 정보 플랫폼의 핵심 웹 애플리케이션입니다. **웹으로 개발하지만 실제로는 React Native 앱에서 WebView로 렌더링되는 하이브리드 구조**를 채택하고 있습니다.

## 🌐 앱 정보

- **앱 이름**: 혜택을 알려줘 (BenefitAllyeojyo)
- **버전**: 1.0.0
- **개발 도구**: React 19 + Vite + React Router
- **실제 배포**: React Native WebView (모바일 앱)
- **개발 환경**: 웹 브라우저 (디버깅용)

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 시작**
   ```bash
   npm run dev
   ```

3. **브라우저에서 확인**
   - `http://localhost:5173`에서 웹앱 확인
   - **참고**: 이는 디버깅용이며, 실제 제품은 모바일 앱에서 WebView로 실행됩니다

### 추가 실행 옵션

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 🏗️ 프로젝트 구조

```
heyyoung-webapp/
├── 📱 src/
│   ├── App.jsx                    # 메인 앱 컴포넌트
│   ├── main.jsx                   # 앱 진입점
│   ├── index.css                  # 글로벌 스타일
│   ├── App.css                    # 앱 스타일
│   ├── 📁 Page/                   # 페이지 컴포넌트들
│   │   ├── MainHomePage.jsx       # 메인 홈페이지
│   │   ├── BenefitMainPage.jsx    # 혜택 메인 페이지
│   │   ├── EntireMenuPage.jsx     # 전체 메뉴 페이지
│   │   ├── MapView.jsx            # 지도 뷰
│   │   ├── StoreDetailPage.jsx    # 매장 상세 페이지
│   │   ├── NotificationPage.jsx   # 알림 페이지
│   │   ├── PartnershipMainPage.jsx # 파트너십 메인
│   │   ├── PartnershipListPage.jsx # 파트너십 리스트
│   │   ├── PaymentPage.jsx        # 결제 페이지
│   │   ├── PaymentResultPage.jsx  # 결제 결과 페이지
│   │   └── NotFound.jsx           # 404 페이지
│   ├── 📁 Components/             # 재사용 가능한 컴포넌트
│   │   ├── 📁 atoms/              # 기본 컴포넌트 (Button, Input 등)
│   │   ├── 📁 molecules/          # 복합 컴포넌트 (Card, List 등)
│   │   └── 📁 layout/             # 레이아웃 컴포넌트
│   ├── 📁 Store/                  # 상태 관리
│   ├── 📁 Redux/                  # Redux 설정
│   ├── 📁 services/               # API 서비스
│   ├── 📁 hooks/                  # 커스텀 훅
│   ├── 📁 utils/                  # 유틸리티 함수
│   │   └── reactNativeBridge.js   # React Native 브리지
│   └── 📁 assets/                 # 정적 리소스
├── 📦 package.json                # 프로젝트 설정
├── ⚙️ vite.config.js              # Vite 설정
├── 🔧 eslint.config.js            # ESLint 설정
└── 📋 index.html                  # HTML 템플릿
```

## 🔧 주요 기능

### 1. 하이브리드 앱 아키텍처
- **웹으로 개발, 앱으로 배포**: React로 개발하지만 실제로는 React Native WebView에서 실행
- **React Native 브리지**: 네이티브 기능과 웹 기능의 연동
- **크로스 플랫폼**: iOS, Android에서 동일한 웹 코드 실행

### 2. 혜택 정보 시스템
- **혜택 검색**: 카테고리별 혜택 정보 조회
- **지도 기반 검색**: 위치 기반 매장 및 혜택 찾기
- **매장 상세 정보**: 영업시간, 할인율, 리뷰 등

### 3. 결제 시스템
- **QR 코드 생성**: 사용자별 고유 QR 코드
- **결제 프로세스**: 할인율 적용 및 결제 처리
- **결제 내역**: 거래 기록 및 영수증

### 4. 파트너십 관리
- **제휴 업체 목록**: 학교별 제휴 매장 정보
- **파트너십 상세**: 업체별 혜택 및 정보
- **지점별 관리**: 브랜드별 지점 정보

### 5. 알림 시스템
- **푸시 알림**: 새로운 혜택 및 이벤트 알림
- **알림 설정**: 사용자별 알림 관리
- **실시간 업데이트**: 실시간 혜택 정보 업데이트

## 📱 React Native 연동

### React Native 브리지

`src/utils/reactNativeBridge.js`에서 웹과 네이티브 앱 간의 통신을 관리합니다:

```javascript
// 네이티브 앱으로 메시지 전송
window.ReactNative.navigate('home');
window.ReactNative.share('혜택 정보');
window.ReactNative.callFunction('openCamera');

// 네이티브 앱에서 메시지 수신
window.ReactNative.addEventListener('PUSH_NOTIFICATION', (data) => {
  console.log('푸시 알림 수신:', data);
});
```

### 환경 감지

```javascript
// React Native 환경인지 웹 환경인지 자동 감지
const bridge = new ReactNativeBridge();
const env = bridge.getEnvironment();

if (env.isReactNative) {
  console.log('모바일 앱에서 실행 중');
} else {
  console.log('웹 브라우저에서 실행 중');
}
```

## 🎨 디자인 시스템

### 색상 팔레트
```css
:root {
  --color-primary: #542BA8;    /* 보라색 */
  --color-accent: #7635FD;     /* 바이올렛 */
  --color-bg: #F6F4FF;         /* 배경색 */
  --color-text: #2C2C2C;       /* 텍스트 */
  --color-gray: #6E6B7A;       /* 회색 */
}
```

### 폰트 시스템
- **원신한 폰트 패밀리** 사용
- **Bold, Medium, Light** 웨이트 지원
- **반응형 타이포그래피** 적용

### 컴포넌트 아키텍처
- **Atomic Design** 패턴 적용
- **Atoms**: Button, Input, Text 등 기본 컴포넌트
- **Molecules**: Card, List, Form 등 복합 컴포넌트
- **Layout**: AppShell, PageTransition 등 레이아웃 컴포넌트

## 🔧 개발 설정

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=혜택을 알려줘
VITE_APP_VERSION=1.0.0
```

### Vite 설정

`vite.config.js`에서 개발 서버 및 빌드 설정을 관리합니다:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // 에셋 파일명 설정
        }
      }
    }
  }
});
```

## 📱 페이지별 기능

### 1. MainHomePage (메인 홈)
- **혜택 카테고리**: 음식, 쇼핑, 문화 등
- **추천 혜택**: 사용자 맞춤 혜택 추천
- **퀵 메뉴**: 자주 사용하는 기능

### 2. BenefitMainPage (혜택 메인)
- **혜택 목록**: 카테고리별 혜택 정보
- **필터링**: 가격, 거리, 카테고리별 필터
- **정렬**: 인기순, 거리순, 가격순

### 3. MapView (지도 뷰)
- **지도 표시**: 카카오맵 기반 지도
- **매장 마커**: 제휴 매장 위치 표시
- **상세 정보**: 마커 클릭 시 매장 정보

### 4. StoreDetailPage (매장 상세)
- **매장 정보**: 주소, 전화번호, 영업시간
- **혜택 정보**: 할인율, 혜택 조건
- **리뷰 시스템**: 사용자 리뷰 및 평점

### 5. PaymentPage (결제 페이지)
- **QR 코드 스캔**: 카메라로 QR 코드 인식
- **결제 정보**: 금액, 할인율, 최종 금액
- **결제 처리**: 실제 결제 진행

## 🚀 배포 및 빌드

### 개발 빌드

```bash
# 개발용 빌드
npm run build

# 빌드 결과 확인
npm run preview
```

### 프로덕션 배포

실제 제품은 React Native 앱에서 WebView로 실행됩니다:

1. **웹 빌드**: `npm run build`로 정적 파일 생성
2. **앱 통합**: React Native 앱의 WebView에서 로드
3. **네이티브 연동**: React Native 브리지를 통한 기능 연동

### 빌드 최적화

- **코드 스플리팅**: React.lazy()를 통한 지연 로딩
- **이미지 최적화**: WebP 포맷 및 압축 적용
- **번들 최적화**: Tree shaking 및 코드 분할

## 🐛 디버깅

### 웹 개발 디버깅

```bash
# 개발 서버 실행
npm run dev

# 브라우저 개발자 도구에서 확인
# - Console: 로그 확인
# - Network: API 호출 확인
# - React DevTools: 컴포넌트 상태 확인
```

### 모바일 앱 디버깅

```javascript
// React Native 브리지 디버깅
console.log('환경 정보:', window.ReactNative.getEnvironment());
console.log('앱 정보:', await window.ReactNative.getAppInfo());
```

### 일반적인 문제 해결

1. **API 연결 실패**
   - `.env` 파일의 API URL 확인
   - CORS 설정 확인
   - 네트워크 연결 상태 확인

2. **React Native 연동 실패**
   - 브리지 초기화 확인
   - 메시지 형식 확인
   - 네이티브 앱 상태 확인

3. **빌드 오류**
   - 의존성 설치 확인
   - Node.js 버전 확인
   - 환경 변수 설정 확인

## 📋 스크립트

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 🔗 관련 링크

- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [React Router 문서](https://reactrouter.com/)
- [Redux Toolkit 문서](https://redux-toolkit.js.org/)

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인하세요
2. 새로운 브랜치를 생성하세요
3. 변경사항을 커밋하세요
4. Pull Request를 생성하세요

## 📝 개발 노트

### 하이브리드 앱 개발 시 주의사항

- **웹 표준 준수**: 모바일 브라우저 호환성 고려
- **성능 최적화**: 모바일 환경에서의 성능 최적화
- **터치 인터페이스**: 모바일에 최적화된 UI/UX
- **네이티브 연동**: React Native 브리지를 통한 기능 확장

---

**헤이영 웹앱** - 웹으로 개발하지만 앱으로 배포되는 혁신적인 하이브리드 플랫폼 🌐📱✨
