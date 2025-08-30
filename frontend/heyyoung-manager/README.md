# 헤이영 매니저 앱 (heyyoung-manager)

매장 관리자와 학교 관계자를 위한 전용 관리 애플리케이션입니다. QR 코드 스캔을 통한 결제 처리와 대시보드를 통한 매출 통계 확인 기능을 제공합니다.

## 📱 앱 정보

- **앱 이름**: heyyoung-camera
- **버전**: 1.0.0
- **플랫폼**: iOS, Android
- **개발 도구**: React Native + Expo
- **주요 기능**: QR 스캔, 결제 처리, 대시보드

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
   npm start
   ```

3. **모바일에서 실행**
   - 터미널에 표시되는 QR 코드를 스캔
   - Expo Go 앱으로 QR 코드를 스캔하여 앱 실행

## 🏗️ 프로젝트 구조

```
heyyoung-manager/
├── 📱 App.js                      # 메인 앱 컴포넌트
├── 📦 package.json                # 프로젝트 설정 및 의존성
├── ⚙️ app.json                    # Expo 설정
├── 🔧 app.config.js               # Expo 설정 (JavaScript)
├── 📁 pages/                      # 페이지 컴포넌트들
│   ├── IndexPage.js               # 메인 인덱스 페이지
│   ├── BranchSelectPage.js        # 지점 선택 페이지
│   ├── PaymentPage.js             # 결제 및 QR 스캔 페이지
│   ├── DashboardPage.js           # 사장님 대시보드
│   └── SchoolDashboardPage.js     # 학교 대시보드
└── 🖼️ assets/                     # 앱 리소스
    ├── icon.png                   # 앱 아이콘
    ├── splash-icon.png            # 스플래시 화면
    ├── adaptive-icon.png          # Android 적응형 아이콘
    └── favicon.png                # 웹 파비콘
```

## 🔧 주요 기능

### 1. QR 코드 스캔 시스템
- **Expo Camera** 기반 QR 코드 스캔
- 실시간 QR 코드 인식 및 처리
- 카메라 권한 관리 및 오류 처리

#### QR 스캔 기능
- 고객의 QR 코드 스캔
- 자동 결제 정보 인식
- 스캔 결과 실시간 처리

### 2. 결제 처리 시스템
- 지점 ID 기반 할인율 적용
- 실시간 금액 계산
- 결제 내역 저장 및 관리

#### 결제 프로세스
1. **지점 선택**: 지점 ID 입력
2. **QR 스캔**: 고객 QR 코드 스캔
3. **금액 입력**: 원래 금액 입력
4. **할인 적용**: 자동 할인율 계산
5. **결제 완료**: 최종 금액 확인 및 결제

### 3. 대시보드 시스템
- **사장님 대시보드**: 매출 통계 및 매장 관리
- **학교 대시보드**: 제휴 업점 현황 및 관리

#### 대시보드 기능
- 일일/월간 매출 통계
- 제휴 업점 현황
- 할인율 설정 및 관리
- 거래 내역 조회

### 4. 네비게이션 시스템
- 커스텀 네비게이션 구현
- 페이지 간 데이터 전달
- 뒤로가기 기능 지원

## 📱 페이지별 상세 기능

### 1. IndexPage (메인 페이지)
- **사장님 결제하기**: QR 스캔으로 결제 진행
- **사장님 대시보드**: 매출 및 통계 확인
- **학교 대시보드**: 제휴 업점 확인

### 2. BranchSelectPage (지점 선택)
- 지점 ID 입력
- 지점 정보 검증
- 결제 페이지로 이동

### 3. PaymentPage (결제 및 QR 스캔)
- **카메라 모드**: QR 코드 스캔
- **폼 모드**: 수동 결제 정보 입력
- 실시간 할인율 적용
- 결제 완료 처리

### 4. DashboardPage (사장님 대시보드)
- 매출 통계 표시
- 거래 내역 조회
- 매장 설정 관리

### 5. SchoolDashboardPage (학교 대시보드)
- 제휴 업점 현황
- 학교별 통계
- 제휴 관리 기능

## 🔧 개발 설정

### 환경 변수 설정

`app.config.js`에서 API 설정을 관리합니다:

```javascript
export default {
  expo: {
    // ... 기타 설정
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
    },
  },
};
```

### API 엔드포인트

주요 API 엔드포인트:

```javascript
// 지점 정보 조회
GET /partnerships/{branchId}

// 결제 처리
POST /payments

// 대시보드 데이터
GET /dashboard/stats
GET /dashboard/transactions
```

## 📱 빌드 및 배포

### Expo Build 설정

`app.json`에서 빌드 설정을 관리합니다:

```json
{
  "expo": {
    "name": "heyyoung-camera",
    "slug": "heyyoung-camera",
    "version": "1.0.0",
    "plugins": [
      "expo-barcode-scanner"
    ]
  }
}
```

### 빌드 명령어

```bash
# 개발 빌드
expo build:android --type apk
expo build:ios --type archive

# 프로덕션 빌드
eas build --platform android
eas build --platform ios
```

## 🔔 QR 스캔 개발

### 카메라 권한 관리

```javascript
import { CameraView, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();

// 권한 요청
if (!permission?.granted) {
  const permissionResult = await requestPermission();
  if (!permissionResult.granted) {
    Alert.alert('카메라 권한이 필요합니다.');
    return;
  }
}
```

### QR 코드 스캔 처리

```javascript
const handleBarCodeScanned = ({ type, data }) => {
  if (isHandlingScanRef.current) return;
  isHandlingScanRef.current = true;
  
  setScanned(true);
  setQrToken(data);
  
  // QR 코드 데이터 처리
  processQRCode(data);
};
```

## 🐛 디버깅

### 로그 확인

개발 중에는 다음 로그들을 확인하세요:

- QR 스캔 성공/실패 로그
- API 호출 상태 로그
- 결제 처리 로그
- 카메라 권한 로그

### 일반적인 문제 해결

1. **QR 코드 스캔이 안 될 때**
   - 카메라 권한 확인
   - QR 코드가 올바른 형식인지 확인
   - 카메라 초점 조정

2. **결제 처리 실패**
   - 지점 ID 유효성 확인
   - API 서버 연결 상태 확인
   - 네트워크 연결 확인

3. **대시보드 데이터 로딩 실패**
   - API 엔드포인트 확인
   - 인증 토큰 유효성 확인
   - 서버 응답 형식 확인

## 📋 스크립트

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

## 🔗 관련 링크

- [Expo Camera 문서](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Barcode Scanner 문서](https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/)
- [React Native 문서](https://reactnative.dev/)

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인하세요
2. 새로운 브랜치를 생성하세요
3. 변경사항을 커밋하세요
4. Pull Request를 생성하세요

---

**헤이영 매니저** - 매장 관리자를 위한 스마트한 결제 관리 시스템 🏪💳
