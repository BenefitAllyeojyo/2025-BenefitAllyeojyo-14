# Hooks 폴더

이 폴더는 React 커스텀 훅들을 포함합니다.

## 파일 구조

### useStores.js
- **용도**: 스토어와 파트너십 정보를 가져오는 커스텀 훅
- **기능**: 
  - API에서 스토어 데이터 로드
  - API에서 파트너십 데이터 로드
  - 로딩 상태 관리
  - 에러 처리 및 폴백 데이터 제공
  - 데이터 새로고침 기능

## 사용법

```jsx
import { useStores } from '../hooks/useStores';

const MyComponent = () => {
  const { stores, partnerships, isLoading, error, refetch } = useStores(1);
  
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  
  return (
    <div>
      {stores.map(store => (
        <div key={store.id}>{store.name}</div>
      ))}
    </div>
  );
};
```

## 장점

1. **재사용성**: 여러 컴포넌트에서 동일한 로직 사용 가능
2. **관심사 분리**: 데이터 로딩 로직을 UI 컴포넌트와 분리
3. **테스트 용이성**: 훅 단위로 독립적 테스트 가능
4. **유지보수성**: API 로직 변경 시 한 곳에서만 수정

