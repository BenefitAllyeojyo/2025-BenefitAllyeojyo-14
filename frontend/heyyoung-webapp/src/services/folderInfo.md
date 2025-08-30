# Services 폴더

이 폴더는 외부 API와의 통신을 담당하는 서비스 함수들을 포함합니다.

## 파일 구조

### api.js
- **용도**: 외부 API 호출을 위한 함수들
- **기능**: 
  - `fetchPartnerships`: 대학 파트너십 정보 가져오기
  - `fetchStores`: 스토어 정보 가져오기 (현재는 목데이터)
  - 에러 처리 및 응답 검증
  - 환경변수를 통한 API 엔드포인트 관리

## 사용법

```jsx
import { fetchPartnerships, fetchStores } from '../services/api';

// 직접 사용 (권장하지 않음)
const data = await fetchPartnerships(1);

// 커스텀 훅을 통한 사용 (권장)
import { useStores } from '../hooks/useStores';
const { stores, partnerships } = useStores(1);
```

## 환경변수 설정

`.env` 파일에 다음 내용 추가:
```bash
VITE_API_BASE_URL=http://api.brainpix.net
VITE_PARTNERSHIPS_API_ENDPOINT=/partnerships/university
```

## 장점

1. **중앙화된 API 로직**: 모든 API 호출을 한 곳에서 관리
2. **재사용성**: 여러 컴포넌트에서 동일한 API 함수 사용
3. **에러 처리**: 일관된 에러 처리 로직
4. **환경별 설정**: 개발/운영 환경에 따른 API 엔드포인트 관리
5. **테스트 용이성**: API 함수 단위로 독립적 테스트 가능

## 주의사항

- **직접 사용 금지**: 컴포넌트에서 직접 `api.js` 함수를 호출하지 말고 `hooks`를 통해 사용
- **에러 처리**: 항상 try-catch로 에러 상황 대비
- **환경변수**: 민감한 정보는 환경변수로 관리
