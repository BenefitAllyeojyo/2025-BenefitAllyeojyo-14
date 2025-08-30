# 헤이영 모바일 앱 (HeyYoungMobile)

대학생들을 위한 혜택 정보 플랫폼의 모바일 애플리케이션입니다. 위치 기반 혜택 추천, 푸시 알림, 지도 서비스 등을 제공합니다.

## 📱 앱 정보

- **앱 이름**: 헤이영, 혜택을 알려줘!
- **버전**: 1.0.0
- **플랫폼**: iOS, Android
- **개발 도구**: React Native + Expo

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go 앱 (모바일 기기에 설치)

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 시작**
   ```bash
   npx expo start
   ```

3. **모바일에서 실행**
   - 터미널에 표시되는 QR 코드를 스캔
   - Expo Go 앱으로 QR 코드를 스캔하여 앱 실행

### 추가 실행 옵션

```bash
# 네트워크 모드로 실행 (같은 Wi-Fi 네트워크에서)
npx expo start:network

# 터널 모드로 실행 (다른 네트워크에서도 접근 가능)
npx expo start:tunnel

# 캐시 클리어 후 실행
npx expo start:clear

# 타임아웃 설정 (60초)
npx expo start:timeout
```

## 🏗️ 프로젝트 구조

```
HeyYoungMobile/
├── 📱 App.tsx                    # 메인 앱 컴포넌트
├── 📦 package.json               # 프로젝트 설정 및 의존성
├── ⚙️ app.json                   # Expo 설정
├── 🔧 babel.config.js            # Babel 설정
├── 📋 tsconfig.json              # TypeScript 설정
├── 🏗️ eas.json                   # EAS Build 설정
├── 📁 src/
│   ├── 📋 config/
│   │   └── api.ts                # API 설정
│   ├── 🔔 services/
│   │   └── pushNotification.ts   # 푸시 알림 서비스
│   └── 📝 types/
│       └── env.d.ts              # 환경 변수 타입 정의
└── 🖼️ assets/
    └── images/
        ├── heyyoungLogo.png      # 앱 아이콘
        └── pages/
            └── bottom-tab1.png   # 탭 아이콘
```

## 🔧 주요 기능

### 1. 웹뷰 기반 하이브리드 앱
- React Native WebView를 사용하여 웹 애플리케이션을 네이티브 앱으로 래핑
- 네이티브 기능과 웹 기능의 최적 조합

### 2. 푸시 알림 시스템
- **Expo Notifications** 기반 푸시 알림
- 실시간 혜택 알림 및 결제 리마인더
- Android 채널 설정 및 권한 관리

#### 푸시 알림 기능
- 새로운 혜택 알림 (`NEW_BENEFIT`)
- 결제 리마인더 (`PAYMENT_REMINDER`)
- 일반 알림 (`NOTIFICATION`)
- 포그라운드/백그라운드 알림 처리

### 3. 네비게이션 시스템
- 웹뷰 내 페이지 네비게이션
- 네이티브 뒤로가기 버튼 지원
- 브라우저 히스토리 관리

### 4. 오프라인 지원
- 네트워크 연결 상태 감지
- 오프라인 시 재시도 기능
- 로딩 상태 표시

### 5. 환경 설정
- `.env` 파일을 통한 환경 변수 관리
- 개발/프로덕션 환경 분리
- API 엔드포인트 설정

## 🔧 개발 설정

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
VITE_API_BASE_URL=http://your-backend-ip:8080
VITE_PUSH_TOKEN_ENDPOINT=/api/push-tokens
VITE_PUSH_TEST_ENDPOINT=/api/push/test
```

### API 설정

`src/config/api.ts`에서 백엔드 API 설정을 관리합니다:

```typescript
export const API_CONFIG = {
  baseUrl: VITE_API_BASE_URL || 'http://localhost:8080',
  pushTokenEndpoint: VITE_PUSH_TOKEN_ENDPOINT || '/api/push-tokens',
  pushTestEndpoint: VITE_PUSH_TEST_ENDPOINT || '/api/push/test',
};
```

## 📱 빌드 및 배포

### EAS Build 설정

`eas.json` 파일에서 빌드 설정을 관리합니다:

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### 빌드 명령어

```bash
# 개발 빌드
eas build --profile development --platform android
eas build --profile development --platform ios

# 프로덕션 빌드
eas build --profile production --platform android
eas build --profile production --platform ios
```

## 🔔 푸시 알림 개발

### 푸시 알림 서비스

`src/services/pushNotification.ts`에서 푸시 알림 관련 기능을 관리합니다:

#### 주요 메서드
- `requestPermissions()`: 푸시 알림 권한 요청
- `getPushToken()`: Expo 푸시 토큰 가져오기
- `sendTokenToServer()`: 서버에 토큰 전송
- `setupAndroidChannel()`: Android 알림 채널 설정

#### 테스트 알림

```typescript
import { PushNotificationService } from './src/services/pushNotification';

// 로컬 테스트 알림
await PushNotificationService.sendLocalNotification(
  '테스트 제목',
  '테스트 내용'
);

// 서버에서 테스트 알림 요청
await PushNotificationService.requestTestNotificationFromServer(1);
```

## 🐛 디버깅

### 로그 확인

개발 중에는 다음 로그들을 확인하세요:

- 푸시 토큰 생성 및 전송 로그
- API 호출 상태 로그
- 웹뷰 네비게이션 로그
- 오프라인 상태 로그

### 일반적인 문제 해결

1. **QR 코드 스캔이 안 될 때**
   - 같은 Wi-Fi 네트워크에 연결되어 있는지 확인
   - `npm run dev:tunnel` 사용

2. **푸시 알림이 안 올 때**
   - Expo Go에서 푸시 알림 권한 확인
   - EAS Project ID 설정 확인

3. **API 연결 실패**
   - `.env` 파일의 API URL 확인
   - 백엔드 서버 실행 상태 확인

## 📋 스크립트

```json
{
  "scripts": {
    "start": "expo start",
    "dev": "expo start",
    "dev:tunnel": "expo start --tunnel",
    "start:network": "expo start --lan",
    "start:lan": "expo start --lan",
    "start:clear": "expo start --clear",
    "start:timeout": "EXPO_TIMEOUT=60000 expo start --lan",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

## 🔗 관련 링크

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Native 문서](https://reactnative.dev/)
- [Expo Notifications 가이드](https://docs.expo.dev/versions/latest/sdk/notifications/)

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인하세요
2. 새로운 브랜치를 생성하세요
3. 변경사항을 커밋하세요
4. Pull Request를 생성하세요

---

**헤이영 모바일** - 대학생들을 위한 스마트한 혜택 플랫폼 📱✨
