import { VITE_API_BASE_URL, VITE_PUSH_TOKEN_ENDPOINT, VITE_PUSH_TEST_ENDPOINT } from '@env';

// .env 파일의 VITE 환경변수를 직접 사용한 백엔드 API 설정
export const API_CONFIG = {
  // .env 파일에서 VITE 환경변수 직접 가져오기
  baseUrl: VITE_API_BASE_URL || 'http://localhost:8080',
  pushTokenEndpoint: VITE_PUSH_TOKEN_ENDPOINT || '/api/push-tokens',
  pushTestEndpoint: VITE_PUSH_TEST_ENDPOINT || '/api/push/test',
};

// API 엔드포인트들
export const API_ENDPOINTS = {
  pushTokens: `${API_CONFIG.baseUrl}${API_CONFIG.pushTokenEndpoint}`,
  pushTest: `${API_CONFIG.baseUrl}${API_CONFIG.pushTestEndpoint}`,
};

// API 헤더
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// 환경 정보 출력
console.log('🌍 .env 파일 환경변수 확인:');
console.log('🔗 VITE_API_BASE_URL:', VITE_API_BASE_URL);
console.log('📱 Push Token Endpoint:', API_ENDPOINTS.pushTokens);
console.log('🧪 Push Test Endpoint:', API_ENDPOINTS.pushTest);

// 환경변수 설정 가이드
console.log('💡 .env 파일 설정 방법:');
console.log('   프로젝트 루트에 .env 파일을 생성하고:');
console.log('   VITE_API_BASE_URL=http://your-backend-ip:8080');
console.log('   VITE_PUSH_TOKEN_ENDPOINT=/api/push-tokens');
console.log('   VITE_PUSH_TEST_ENDPOINT=/api/push/test');
