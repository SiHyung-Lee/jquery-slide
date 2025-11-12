# jQuery Slide

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/jquery-slide.svg)](https://badge.fury.io/js/jquery-slide)

무한 루프와 자동 재생 기능을 갖춘 모던 바닐라 JavaScript 캐러셀 슬라이더입니다.

## ✨ 주요 기능

- 🎯 **순수 바닐라 JavaScript** - jQuery 의존성 제거
- 🔄 **무한 루프** - 끊김 없는 순환 슬라이드
- ⏱️ **자동 재생** - 설정 가능한 자동 전환
- 📱 **터치 지원** - 모바일 스와이프 제스처
- 🎨 **CSS Transform** - GPU 가속을 활용한 부드러운 애니메이션
- ♿ **접근성** - ARIA 속성 및 키보드 네비게이션 지원
- 📦 **경량** - 최소화된 번들 크기
- 🎛️ **커스터마이징** - 다양한 옵션 제공
- 🌙 **다크 모드** - prefers-color-scheme 지원

## 📦 설치

### npm

```bash
npm install jquery-slide
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/jquery-slide/dist/jquery-slide.css">
<script src="https://unpkg.com/jquery-slide/dist/jquery-slide.min.js"></script>
```

### 수동 설치

[릴리스 페이지](https://github.com/SiHyung-Lee/jquery-slide/releases)에서 최신 버전을 다운로드하세요.

## 🚀 사용 방법

### 기본 사용법

#### HTML 구조

```html
<div class="featured-service js-slider">
  <ul class="js-slide-container">
    <li class="slide-item">
      <h2>슬라이드 1</h2>
    </li>
    <li class="slide-item">
      <h2>슬라이드 2</h2>
    </li>
    <li class="slide-item">
      <h2>슬라이드 3</h2>
    </li>
    <li class="slide-item">
      <h2>슬라이드 4</h2>
    </li>
  </ul>

  <!-- 인디케이터 -->
  <span class="slide-counter js-slide-counter">
    <button class="slide-count active" type="button">첫번째</button>
    <button class="slide-count" type="button">두번째</button>
    <button class="slide-count" type="button">세번째</button>
    <button class="slide-count" type="button">네번째</button>
  </span>

  <!-- 네비게이션 버튼 -->
  <span>
    <button class="slide-prev slide-button js-slide-prev" type="button">이전</button>
    <button class="slide-next slide-button js-slide-next" type="button">다음</button>
  </span>
</div>
```

#### CSS

```html
<link rel="stylesheet" href="path/to/jquery-slide.css">
```

#### JavaScript

```javascript
// ES6 모듈
import Slider from 'jquery-slide';

const slider = new Slider('.js-slider', {
  delay: 5000,      // 자동 전환 간격 (밀리초)
  autoplay: true,   // 자동 재생 활성화
  speed: 500,       // 전환 속도 (밀리초)
  infinite: true,   // 무한 루프
  swipe: true       // 터치 스와이프
});
```

```javascript
// UMD (브라우저)
<script src="path/to/jquery-slide.min.js"></script>
<script>
  const slider = new Slider('.js-slider');
</script>
```

## ⚙️ 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `delay` | Number | `5000` | 자동 슬라이드 전환 간격 (밀리초) |
| `autoplay` | Boolean | `true` | 자동 재생 활성화 여부 |
| `speed` | Number | `500` | 슬라이드 전환 애니메이션 속도 (밀리초) |
| `infinite` | Boolean | `true` | 무한 루프 활성화 여부 |
| `swipe` | Boolean | `true` | 터치 스와이프 활성화 여부 |

## 🎮 API

### 메서드

#### `next()`
다음 슬라이드로 이동합니다.

```javascript
slider.next();
```

#### `prev()`
이전 슬라이드로 이동합니다.

```javascript
slider.prev();
```

#### `goTo(index)`
특정 인덱스의 슬라이드로 이동합니다.

```javascript
slider.goTo(2); // 3번째 슬라이드로 이동
```

#### `startAutoplay()`
자동 재생을 시작합니다.

```javascript
slider.startAutoplay();
```

#### `stopAutoplay()`
자동 재생을 중지합니다.

```javascript
slider.stopAutoplay();
```

#### `destroy()`
슬라이더를 파괴하고 이벤트 리스너를 제거합니다.

```javascript
slider.destroy();
```

### 프로퍼티

#### `currentIndex`
현재 슬라이드의 인덱스를 반환합니다.

```javascript
console.log(slider.currentIndex); // 0, 1, 2, ...
```

## 🎨 커스터마이징

CSS 변수를 사용하여 스타일을 쉽게 커스터마이징할 수 있습니다:

```css
.js-slider {
  --slider-transition-speed: 500ms;
  --slider-button-bg: rgba(255, 255, 255, 0.8);
  --slider-button-hover-bg: rgba(255, 255, 255, 1);
  --slider-indicator-color: #fff;
  --slider-indicator-active-color: #01a3ec;
}
```

## 🔧 개발

### 설치

```bash
npm install
```

### 개발 서버

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 테스트

```bash
npm test
```

### 테스트 (Watch 모드)

```bash
npm run test:watch
```

## 📁 프로젝트 구조

```
jquery-slide/
├── src/
│   ├── index.js      # 메인 엔트리 포인트
│   ├── slider.js     # 슬라이더 클래스
│   └── slider.css    # 스타일시트
├── dist/             # 빌드된 파일
├── __tests__/        # 테스트 파일
├── examples/         # 예제 파일
├── package.json
├── rollup.config.js
└── README.md
```

## 🌐 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)
- iOS Safari 12+
- Android Chrome 90+

## 📝 변경 로그

### v2.0.0 (2025)

- 🎉 **주요 변경사항**
  - jQuery 의존성 제거, 순수 바닐라 JavaScript로 재작성
  - ES6+ 모듈 시스템 적용
  - CSS transform/transition 사용으로 성능 개선
  - JSDoc 기반 타입 문서화
  - Jest를 활용한 테스트 코드 추가
  - Rollup 빌드 시스템 구축
  - 접근성 개선 (ARIA 속성, 키보드 네비게이션)
  - 다크 모드 및 반응형 디자인 지원
  - prefers-reduced-motion 지원

### v1.0.0

- 초기 jQuery 기반 버전

## 🤝 기여

기여는 언제나 환영합니다! 이슈를 열거나 풀 리퀘스트를 제출해 주세요.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👤 작성자

**SiHyung-Lee**

- GitHub: [@SiHyung-Lee](https://github.com/SiHyung-Lee)

## 🙏 감사의 말

이 프로젝트는 기존 jQuery 기반 슬라이더를 현대화하여 만들어졌습니다.

## 📮 문의

질문이나 제안사항이 있으시면 [이슈](https://github.com/SiHyung-Lee/jquery-slide/issues)를 열어주세요.
