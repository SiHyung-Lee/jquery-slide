/**
 * @jest-environment jsdom
 */

import Slider from '../src/slider.js';

describe('Slider', () => {
  let container;

  beforeEach(() => {
    // 테스트용 HTML 구조 생성
    document.body.innerHTML = `
      <div class="featured-service js-slider">
        <ul class="featured-service-inner js-slide-container">
          <li class="featured-service-wrap active">
            <h2 class="featured-title">Slide 1</h2>
          </li>
          <li class="featured-service-wrap">
            <h2 class="featured-title">Slide 2</h2>
          </li>
          <li class="featured-service-wrap">
            <h2 class="featured-title">Slide 3</h2>
          </li>
          <li class="featured-service-wrap">
            <h2 class="featured-title">Slide 4</h2>
          </li>
        </ul>
        <span class="slide-counter js-slide-counter">
          <button class="slide-count active" type="button">첫번째</button>
          <button class="slide-count" type="button">두번째</button>
          <button class="slide-count" type="button">세번째</button>
          <button class="slide-count" type="button">네번째</button>
        </span>
        <span>
          <button class="slide-prev slide-button js-slide-prev" type="button">이전</button>
          <button class="slide-next slide-button js-slide-next" type="button">다음</button>
        </span>
      </div>
    `;
    container = document.querySelector('.js-slider');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('초기화', () => {
    test('슬라이더 인스턴스가 생성되어야 함', () => {
      const slider = new Slider(container, { autoplay: false });
      expect(slider).toBeInstanceOf(Slider);
    });

    test('선택자 문자열로 인스턴스 생성 가능', () => {
      const slider = new Slider('.js-slider', { autoplay: false });
      expect(slider).toBeInstanceOf(Slider);
    });

    test('유효하지 않은 선택자는 에러를 발생시켜야 함', () => {
      expect(() => {
        new Slider('.invalid-selector', { autoplay: false });
      }).toThrow();
    });

    test('슬라이드가 올바르게 위치해야 함', () => {
      const slider = new Slider(container, { autoplay: false });
      const slides = container.querySelectorAll('.js-slide-container > *');

      slides.forEach((slide, index) => {
        expect(slide.style.transform).toBe(`translateX(${index * 100}%)`);
      });
    });

    test('첫 번째 카운터가 활성화되어야 함', () => {
      const slider = new Slider(container, { autoplay: false });
      const counters = container.querySelectorAll('.js-slide-counter > *');

      expect(counters[0].classList.contains('active')).toBe(true);
      expect(counters[1].classList.contains('active')).toBe(false);
    });
  });

  describe('네비게이션', () => {
    test('next() 메서드가 다음 슬라이드로 이동해야 함', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });

      slider.next();

      setTimeout(() => {
        expect(slider.currentIndex).toBe(1);
        done();
      }, 150);
    });

    test('prev() 메서드가 이전 슬라이드로 이동해야 함', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });

      slider.prev();

      setTimeout(() => {
        expect(slider.currentIndex).toBe(3); // 무한 루프로 마지막 슬라이드
        done();
      }, 150);
    });

    test('goTo() 메서드가 특정 슬라이드로 이동해야 함', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });

      slider.goTo(2);

      setTimeout(() => {
        expect(slider.currentIndex).toBe(2);
        done();
      }, 150);
    });

    test('애니메이션 중에는 이동이 방지되어야 함', () => {
      const slider = new Slider(container, { autoplay: false, speed: 500 });

      slider.next();
      slider.next(); // 애니메이션 중 호출

      expect(slider.isAnimating).toBe(true);
    });
  });

  describe('자동 재생', () => {
    test('autoplay가 true일 때 자동으로 슬라이드가 전환되어야 함', (done) => {
      const slider = new Slider(container, {
        autoplay: true,
        delay: 100,
        speed: 50
      });

      setTimeout(() => {
        expect(slider.currentIndex).toBeGreaterThan(0);
        slider.destroy();
        done();
      }, 200);
    });

    test('stopAutoplay()가 자동 재생을 중지해야 함', () => {
      const slider = new Slider(container, { autoplay: true });

      slider.stopAutoplay();

      expect(slider.timer).toBeNull();
    });

    test('startAutoplay()가 자동 재생을 시작해야 함', () => {
      const slider = new Slider(container, { autoplay: false });

      slider.options.autoplay = true;
      slider.startAutoplay();

      expect(slider.timer).not.toBeNull();
      slider.destroy();
    });
  });

  describe('이벤트', () => {
    test('다음 버튼 클릭 시 다음 슬라이드로 이동', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });
      const nextButton = container.querySelector('.js-slide-next');

      nextButton.click();

      setTimeout(() => {
        expect(slider.currentIndex).toBe(1);
        done();
      }, 150);
    });

    test('이전 버튼 클릭 시 이전 슬라이드로 이동', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });
      const prevButton = container.querySelector('.js-slide-prev');

      prevButton.click();

      setTimeout(() => {
        expect(slider.currentIndex).toBe(3);
        done();
      }, 150);
    });

    test('카운터 클릭 시 해당 슬라이드로 이동', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });
      const counters = container.querySelectorAll('.js-slide-counter > *');

      counters[2].click();

      setTimeout(() => {
        expect(slider.currentIndex).toBe(2);
        done();
      }, 150);
    });
  });

  describe('접근성', () => {
    test('현재 슬라이드의 링크만 tabindex가 0이어야 함', () => {
      // 테스트용 링크 추가
      const slides = container.querySelectorAll('.js-slide-container > *');
      slides.forEach(slide => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Link';
        slide.appendChild(link);
      });

      const slider = new Slider(container, { autoplay: false });
      const links = container.querySelectorAll('.js-slide-container a');

      expect(links[0].getAttribute('tabindex')).toBe('0');
      expect(links[1].getAttribute('tabindex')).toBe('-1');
    });

    test('카운터에 aria-current 속성이 올바르게 설정되어야 함', () => {
      const slider = new Slider(container, { autoplay: false });
      const counters = container.querySelectorAll('.js-slide-counter > *');

      expect(counters[0].getAttribute('aria-current')).toBe('true');
      expect(counters[1].hasAttribute('aria-current')).toBe(false);
    });
  });

  describe('터치/스와이프', () => {
    test('왼쪽 스와이프 시 다음 슬라이드로 이동', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });
      const slideContainer = container.querySelector('.js-slide-container');

      // 터치 시작
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 200 }]
      });
      slideContainer.dispatchEvent(touchStart);

      // 터치 종료 (왼쪽으로 스와이프)
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100 }]
      });
      slideContainer.dispatchEvent(touchEnd);

      setTimeout(() => {
        expect(slider.currentIndex).toBe(1);
        done();
      }, 150);
    });

    test('오른쪽 스와이프 시 이전 슬라이드로 이동', (done) => {
      const slider = new Slider(container, { autoplay: false, speed: 100 });
      const slideContainer = container.querySelector('.js-slide-container');

      // 터치 시작
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100 }]
      });
      slideContainer.dispatchEvent(touchStart);

      // 터치 종료 (오른쪽으로 스와이프)
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 200 }]
      });
      slideContainer.dispatchEvent(touchEnd);

      setTimeout(() => {
        expect(slider.currentIndex).toBe(3);
        done();
      }, 150);
    });
  });

  describe('정리', () => {
    test('destroy() 메서드가 자동 재생을 중지해야 함', () => {
      const slider = new Slider(container, { autoplay: true });

      slider.destroy();

      expect(slider.timer).toBeNull();
    });
  });
});
