
# Redux/      
### 도메인 상태(RTK slices)와 action 로직

### 폴더 구조
```
src/
├─ Redux/      # RTK slices(도메인 상태)와 action 로직
│  └─ slices/
│     ├─ benefitsSlice.js # 혜택 목록/페이지네이션/로딩·에러
│     └─ uiSlice.js       # UI 상태(모달 열림 등, 서버 비의존)
```

### Redux/ (RTK)

- **Slice 1개 = 도메인 1개**. 상태, reducers, thunks를 **한 파일**에 응집.
- **비동기**는 `createAsyncThunk` 사용. API 호출은 **lib/api.js**로 위임.
- **UI 관련 상태**(모달 열림/정렬 키 등)는 `uiSlice` 고정. 서버 데이터와 **혼합 금지**.
- **Selector 규칙**: 페이지/훅에서 `useSelector`로 꺼내 쓰고, 컴포넌트로 **props로만 전달**.

### 하위 폴더
- slices/