
# Store/      
### configureStore. slices만 결합(미들웨어 커스텀도 여기)

### 폴더 구조
```
src/
├─ Store/
│  └─ store.js                   # configureStore. slices만 결합(미들웨어 커스텀도 여기)
```

### Store/

- RTK `configureStore`만 위치. **미들웨어/DevTools** 설정도 여기서
- Store는 **main.jsx**에서 `<Provider store={store}>`

### 하위 폴더

