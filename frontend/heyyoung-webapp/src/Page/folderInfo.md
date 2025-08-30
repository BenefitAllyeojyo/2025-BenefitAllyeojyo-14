
# Page/      
###  라우트(화면). 오직 조립·플로우만, 로직은 hooks/Redux로


### 폴더 구조
```
src/
├─ Page/  # 라우트(화면). 오직 조립·플로우만, 로직은 hooks/Redux로
│  ├─ BenefitsHome.jsx  # 페이지들만
│  ├─ Payment.jsx
│  └─ NotFound.jsx
│

```
### Page/

- **페이지는 조립만**: 컴포넌트 배치, 훅 호출, Redux dispatch/select.
- 파일명은 **PascalCase**(컴포넌트처럼) 사용을 유지(네 구조와 일관성).
- URL → 파일 매핑은 **단방향**. 페이지가 다른 페이지를 직접 import하지 않음.


### 하위 폴더

#### 페이지들로 채우면 됩니다