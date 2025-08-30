# 혜택을 알려줘 (BenefitAllyeojyo)

대학생들을 위한 혜택 정보 플랫폼입니다. 다양한 매장의 할인 혜택과 정보를 추천 제공하며, 결제까지 원스톱으로 이어지는 올인원 기능을 제공합니다

## 📁 프로젝트 구조

```
2025-BenefitAllyeojyo-14/
├── 📱 frontend/                    # 프론트엔드 애플리케이션들
│   ├── heyyoung-webapp/           # React 웹 애플리케이션
│   ├── heyyoung-manager/          # Expo React Native 관리자 앱
│   └── HeyYoungMobile/            # Expo React Native 모바일 앱
├── ⚙️ backend/                     # Java Spring Boot 백엔드
│   ├── community/                 # 커뮤니티 모듈
│   └── core-bank/                 # 핵심 뱅킹 모듈
├── 🤖 backendGPT/                  # Flask 기반 GPT API 서버
└── 📚 docs/                        # 프로젝트 문서
```

## 🚀 기술 스택

### Frontend
- **Web App**: React 19, Vite, React Router
- **Mobile App**:  React Native, Expo
- **Manager App**: React, Expo

### Backend
- **Main Backend**: Java Spring Boot, Gradle
- **GPT API**: Python Flask, OpenAI API

## ⚙️ 백엔드 서비스

### 1. Main Backend (Java)
- **기술**: Spring Boot, Gradle
- **모듈**:
  - `community`: 커뮤니티 기능
  - `core-bank`: 핵심 뱅킹 기능
- **상세 정보**: [backend/README.md](backend/README.md)
- **Swagger API**: https://api.brainpix.net/swagger-ui/index.html#/

### 2. GPT API Server (Python)
- **기술**: Flask, OpenAI API
- **주요 기능**: 자연어 기반 매장 추천, 컨텍스트 분석

## 📱 애플리케이션별 상세 정보

### 1. heyyoung-webapp (웹 애플리케이션)
- **기술**: React 19 + Vite
- **주요 기능**: 혜택 정보 조회, 지도 기반 매장 검색, QR 코드 스캔
- **상세 정보**: [frontend/heyyoung-webapp/README.md](frontend/heyyoung-webapp/README.md)

### 2. HeyYoungMobile (모바일 앱)
- **기술**: React Native + Expo + TypeScript
- **주요 기능**: 위치 기반 혜택 추천, 푸시 알림, 지도 서비스
- **상세 정보**: [frontend/HeyYoungMobile/README.md](frontend/HeyYoungMobile/README.md)

### 3. heyyoung-manager (관리자 앱)
- **기술**: React Native + Expo
- **주요 기능**: QR 코드 스캔, 결제 관리, 매장 관리
- **상세 정보**: [frontend/heyyoung-manager/README.md](frontend/heyyoung-manager/README.md)

## 🎨 디자인 시스템

- **주요 색상**: 
  - 보라색: `#542BA8`
  - 바이올렛: `#7635FD`
- **폰트**: 원신한 폰트 패밀리 (Bold, Medium, Light)
- **디자인 토큰**: CSS 변수 기반 디자인 시스템

## 🚀 시작하기

각 애플리케이션의 상세한 설치 및 실행 방법은 해당 폴더의 README를 참조하세요:

- [웹 애플리케이션 시작하기](frontend/heyyoung-webapp/README.md)
- [모바일 앱 시작하기](frontend/HeyYoungMobile/README.md)
- [관리자 앱 시작하기](frontend/heyyoung-manager/README.md)
- [백엔드 서버 시작하기](backend/README.md)
- [GPT API 서버 시작하기](backendGPT/README.md)

## 📋 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- Java 17+
- Python 3.8+
- Expo CLI
- Android Studio (모바일 개발용)

### 환경 변수 설정
각 서비스별로 필요한 환경 변수는 해당 README에서 확인하세요.

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인하세요
2. 새로운 브랜치를 생성하세요
3. 변경사항을 커밋하세요
4. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**혜택을 알려줘** - 대학생들을 위한 스마트한 혜택 플랫폼 🎓✨
