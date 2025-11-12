/**
 * @class Slider
 * @description 무한 루프 기능을 가진 모던 바닐라 JavaScript 캐러셀 슬라이더
 */
export default class Slider {
  /**
   * Slider 인스턴스를 생성합니다
   * @param {string|HTMLElement} element - 슬라이더 컨테이너 선택자 또는 DOM 엘리먼트
   * @param {Object} options - 슬라이더 옵션
   * @param {number} [options.delay=5000] - 자동 슬라이드 전환 간격 (밀리초)
   * @param {boolean} [options.autoplay=true] - 자동 재생 활성화 여부
   * @param {number} [options.speed=500] - 슬라이드 전환 애니메이션 속도 (밀리초)
   * @param {boolean} [options.infinite=true] - 무한 루프 활성화 여부
   * @param {boolean} [options.swipe=true] - 터치 스와이프 활성화 여부
   */
  constructor(element, options = {}) {
    // 기본 옵션
    this.options = {
      delay: 5000,
      autoplay: true,
      speed: 500,
      infinite: true,
      swipe: true,
      ...options
    };

    // DOM 엘리먼트 설정
    this.container = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!this.container) {
      throw new Error('슬라이더 컨테이너를 찾을 수 없습니다');
    }

    this.slideContainer = this.container.querySelector('.js-slide-container');
    this.slides = Array.from(this.slideContainer.children);
    this.prevButton = this.container.querySelector('.js-slide-prev');
    this.nextButton = this.container.querySelector('.js-slide-next');
    this.counters = Array.from(
      this.container.querySelectorAll('.js-slide-counter > *')
    );

    // 슬라이더 상태
    this.currentIndex = 0;
    this.isAnimating = false;
    this.timer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // 초기화
    this.init();
  }

  /**
   * 슬라이더 초기화
   * @private
   */
  init() {
    this.setupSlides();
    this.bindEvents();
    this.updateCounters();

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  /**
   * 슬라이드 초기 설정
   * @private
   */
  setupSlides() {
    this.slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
      slide.style.transition = 'none';

      // 접근성: 첫 번째 슬라이드만 활성화
      const links = slide.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('tabindex', index === 0 ? '0' : '-1');
      });
    });
  }

  /**
   * 이벤트 핸들러 바인딩
   * @private
   */
  bindEvents() {
    // 이전/다음 버튼
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // 카운터/인디케이터
    this.counters.forEach((counter, index) => {
      counter.addEventListener('click', () => this.goTo(index));
    });

    // 터치/스와이프 이벤트
    if (this.options.swipe) {
      this.slideContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.slideContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    // 마우스 호버 시 자동 재생 일시 정지
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    });
  }

  /**
   * 터치 시작 핸들러
   * @private
   * @param {TouchEvent} e - 터치 이벤트
   */
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  /**
   * 터치 종료 핸들러
   * @private
   * @param {TouchEvent} e - 터치 이벤트
   */
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  /**
   * 스와이프 방향 처리
   * @private
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  /**
   * 다음 슬라이드로 이동
   * @public
   */
  next() {
    if (this.isAnimating) return;

    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goTo(nextIndex);
  }

  /**
   * 이전 슬라이드로 이동
   * @public
   */
  prev() {
    if (this.isAnimating) return;

    const prevIndex = this.currentIndex === 0
      ? this.slides.length - 1
      : this.currentIndex - 1;
    this.goTo(prevIndex);
  }

  /**
   * 특정 인덱스의 슬라이드로 이동
   * @public
   * @param {number} index - 이동할 슬라이드 인덱스
   */
  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;

    this.isAnimating = true;
    const previousIndex = this.currentIndex;
    this.currentIndex = index;

    // transition 활성화
    this.slides.forEach(slide => {
      slide.style.transition = `transform ${this.options.speed}ms ease-in-out`;
    });

    // 슬라이드 이동
    this.updateSlidePositions();

    // 애니메이션 완료 후 처리
    setTimeout(() => {
      this.isAnimating = false;
      this.updateAccessibility();
      this.resetAutoplay();
    }, this.options.speed);

    // 카운터 업데이트
    this.updateCounters();
  }

  /**
   * 슬라이드 위치 업데이트
   * @private
   */
  updateSlidePositions() {
    this.slides.forEach((slide, index) => {
      let position = (index - this.currentIndex) * 100;

      // 무한 루프를 위한 위치 조정
      if (this.options.infinite) {
        const diff = index - this.currentIndex;
        if (diff < -this.slides.length / 2) {
          position += this.slides.length * 100;
        } else if (diff > this.slides.length / 2) {
          position -= this.slides.length * 100;
        }
      }

      slide.style.transform = `translateX(${position}%)`;
    });
  }

  /**
   * 접근성 속성 업데이트
   * @private
   */
  updateAccessibility() {
    this.slides.forEach((slide, index) => {
      const links = slide.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
      });

      // ARIA 속성 업데이트
      slide.setAttribute('aria-hidden', index !== this.currentIndex);
    });
  }

  /**
   * 카운터/인디케이터 업데이트
   * @private
   */
  updateCounters() {
    this.counters.forEach((counter, index) => {
      if (index === this.currentIndex) {
        counter.classList.add('active');
        counter.setAttribute('aria-current', 'true');
      } else {
        counter.classList.remove('active');
        counter.removeAttribute('aria-current');
      }
    });
  }

  /**
   * 자동 재생 시작
   * @public
   */
  startAutoplay() {
    this.stopAutoplay();
    if (this.options.autoplay) {
      this.timer = setInterval(() => this.next(), this.options.delay);
    }
  }

  /**
   * 자동 재생 중지
   * @public
   */
  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * 자동 재생 재설정
   * @private
   */
  resetAutoplay() {
    if (this.options.autoplay) {
      this.stopAutoplay();
      setTimeout(() => this.startAutoplay(), 2000);
    }
  }

  /**
   * 슬라이더 파괴 (이벤트 리스너 제거 및 정리)
   * @public
   */
  destroy() {
    this.stopAutoplay();

    // 스타일 초기화
    this.slides.forEach(slide => {
      slide.style.transform = '';
      slide.style.transition = '';
    });

    // 이벤트 리스너 제거는 클론 방식으로 처리
    const newContainer = this.container.cloneNode(true);
    this.container.parentNode.replaceChild(newContainer, this.container);
  }
}
