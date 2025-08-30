
# Style/      
###  

### 폴더 구조
```
src/
├─ Style/
│  ├─ tokens.css  # 디자인 토큰(CSS 변수: 색/라운드/간격/그림자)
│  └─ globals.css # 리셋/글로벌 규칙(@font-face, base 스타일, 유틸 클래스)

```
### Style/

- **tokens.css**: 피그마 Variables/Styles 대응(색/간격/라운드/그림자).
    - 예: `-color-brand-500`, `-radius-lg`, `-space-16`, `-shadow-1`

- **globals.css**: 리셋, 기본 폰트, 유틸 클래스(예: `.line-clamp-2`).
- **금지**: 컴포넌트 내부에서 임의 HEX/px 남발. **반드시 토큰 참조**.


### 하위 폴더
- tokens.css    # 디자인 토큰== 자주 쓰는 색이랑 라운드 형태는 미리 정해두고 쓰기!(하드코딩 금지) (CSS 변수: 색/라운드/간격/그림자)
- globals.css  # 리셋/글로벌 규칙(@font-face, base 스타일, 유틸 클래스)
