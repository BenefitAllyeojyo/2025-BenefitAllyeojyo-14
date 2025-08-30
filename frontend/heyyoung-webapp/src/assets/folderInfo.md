
# Assets/                       
###  정적 리소스(빌드시 경로 고정): 이미지·폰트·더미 JSON 등

### Assets/ 폴더 구조
```
src/
├─ Assets/                       
│  ├─ images/   # PNG/JPG/WebP 컴포넌트에서 직접 import하여 사용
│  └─ fonts/    # 웹폰트 파일(.woff2)
```

- **이미지 규격**: UI 썸네일은 가급적 **정사각(1:1)**, 배경/배너는 원본 비율 유지.
- **가져오기**: `import cafeThumb from '@/Assets/images/cafe.webp'`
- **금지**: Assets에서 컴포넌트/JS 모듈 import 금지(단방향 데이터만 존재).

### 하위 폴더

- images/ # PNG/JPG/WebP. 컴포넌트에서 직접 import하여 사용
- fonts/  # 웹폰트 파일(.woff2). 
          (CSS @font-face는 Style/globals.css에서 선언) 