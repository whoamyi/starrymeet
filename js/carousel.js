/**
 * StarryMeet Carousel Controller
 * Handles carousel navigation, auto-scrolling, and touch interactions
 */

class Carousel {
  constructor(container, options = {}) {
    this.container = container;
    this.scrollAmount = options.scrollAmount || 300;
    this.autoScroll = options.autoScroll || false;
    this.autoScrollInterval = options.autoScrollInterval || 3000;
    this.autoScrollTimer = null;

    this.init();
  }

  init() {
    // Setup arrow navigation if arrows exist
    const nav = this.container.closest('.categories-nav, .occasions-nav, .steps-nav, .carousel-nav');
    if (nav) {
      const leftArrow = nav.querySelector('[class*="-arrow-left"]');
      const rightArrow = nav.querySelector('[class*="-arrow-right"]');

      if (leftArrow) {
        leftArrow.addEventListener('click', () => this.scrollLeft());
      }

      if (rightArrow) {
        rightArrow.addEventListener('click', () => this.scrollRight());
      }
    }

    // Setup touch/swipe support
    this.setupTouchSupport();

    // Start auto-scroll if enabled
    if (this.autoScroll) {
      this.startAutoScroll();

      // Pause auto-scroll on hover
      this.container.addEventListener('mouseenter', () => this.pauseAutoScroll());
      this.container.addEventListener('mouseleave', () => this.startAutoScroll());

      // Pause auto-scroll on touch
      this.container.addEventListener('touchstart', () => this.pauseAutoScroll());
      this.container.addEventListener('touchend', () => {
        setTimeout(() => this.startAutoScroll(), 3000);
      });
    }
  }

  scrollLeft() {
    this.container.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.container.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }

  startAutoScroll() {
    if (this.autoScrollTimer) return;

    this.autoScrollTimer = setInterval(() => {
      const maxScroll = this.container.scrollWidth - this.container.clientWidth;
      const currentScroll = this.container.scrollLeft;

      // If at the end, scroll back to start
      if (currentScroll >= maxScroll - 10) {
        this.container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Scroll one item at a time
        const itemWidth = this.container.querySelector(':scope > *')?.offsetWidth || this.scrollAmount;
        const gap = parseInt(getComputedStyle(this.container).gap) || 0;
        this.container.scrollBy({
          left: itemWidth + gap,
          behavior: 'smooth'
        });
      }
    }, this.autoScrollInterval);
  }

  pauseAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }

  setupTouchSupport() {
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - this.container.offsetLeft;
      scrollLeft = this.container.scrollLeft;
      isDragging = true;
    });

    this.container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - this.container.offsetLeft;
      const walk = (x - startX) * 2;
      this.container.scrollLeft = scrollLeft - walk;
    });

    this.container.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Also support mouse drag on desktop
    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - this.container.offsetLeft;
      scrollLeft = this.container.scrollLeft;
      this.container.style.cursor = 'grabbing';
    });

    this.container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - this.container.offsetLeft;
      const walk = (x - startX) * 2;
      this.container.scrollLeft = scrollLeft - walk;
    });

    this.container.addEventListener('mouseup', () => {
      isDragging = false;
      this.container.style.cursor = 'grab';
    });

    this.container.addEventListener('mouseleave', () => {
      isDragging = false;
      this.container.style.cursor = 'grab';
    });
  }
}

// Initialize all carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Categories carousels (no auto-scroll)
  document.querySelectorAll('.categories-container').forEach(container => {
    new Carousel(container, { scrollAmount: 180 });
  });

  // Occasions carousel (with auto-scroll)
  document.querySelectorAll('.occasions-grid').forEach(container => {
    new Carousel(container, {
      scrollAmount: 320,
      autoScroll: true,
      autoScrollInterval: 3000
    });
  });

  // Steps carousel (no auto-scroll)
  document.querySelectorAll('.steps-grid').forEach(container => {
    new Carousel(container, { scrollAmount: 300 });
  });

  // Existing carousels (top-ten, quick-meets, reviews)
  document.querySelectorAll('.top-ten-carousel, .quick-meets-carousel, .reviews-carousel').forEach(container => {
    new Carousel(container, { scrollAmount: 280 });
  });
});
