
# Icons/      
### SVG 아이콘 전용 계층(스프라이트/인라인 관리 일원화)  

가능하면 아이콘들은 SVG 형태로 갖고오기! (이미지 화질 문제 때문에..)

### 폴더 구조
```
src/
├─ Icons/                        # SVG 아이콘 전용 계층
│  ├─ svg/                       # 원본 SVG 파일들
│  └─ index.js                   # 아이콘 매퍼(아이콘 이름→경로)
```



### 하위 폴더
- svg/    # 원본 SVG 파일들 (24px 그리드 기준, stroke=1.5)
- index.js # 아이콘 매퍼(아이콘 이름→경로). 컴포넌트는 여기만 import

### Icons/

- **소스 진입점은 무조건 `Icons/index.js` 하나만**.
- SVG는 **24×24**, stroke=**1.5px**, `fill="none"` 권장.
- 아이콘 사용 예:
    
    ```jsx
    jsx
    코드 복사
    import { icons } from '@/Icons';
    <img src={icons.bookmark} alt="" width="24" height="24" />
    
    ```
    
- **새 아이콘 추가 순서**: `svg/`에 파일 추가 → `index.js`에 키 등록 → 컴포넌트에서 키로 사용.