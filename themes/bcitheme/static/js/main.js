(() => {
  const elements = document.querySelectorAll('[data-animate]');
  elements.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const viewport = carousel.querySelector('[data-carousel-viewport]');
    const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = Number(carousel.dataset.startIndex || 0);
    let pointerStart = null;
    let dragged = false;
    let autoplayTimer = null;

    const circularOffset = (index) => {
      let offset = index - activeIndex;
      const half = slides.length / 2;
      if (offset > half) offset -= slides.length;
      if (offset < -half) offset += slides.length;
      return Math.abs(offset) > 2 ? 'hidden' : String(offset);
    };

    const render = () => {
      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.dataset.offset = circularOffset(index);
        slide.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
      dots.forEach((dot, index) => {
        dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
      });
    };

    const stopAutoplay = () => {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (reduceMotion || carousel.matches(':hover') || carousel.contains(document.activeElement)) return;
      autoplayTimer = window.setInterval(() => goTo(activeIndex + 1, false), 5200);
    };

    const goTo = (index, restartAutoplay = true) => {
      activeIndex = (index + slides.length) % slides.length;
      render();
      if (restartAutoplay) startAutoplay();
    };

    previousButton?.addEventListener('click', () => goTo(activeIndex - 1));
    nextButton?.addEventListener('click', () => goTo(activeIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        if (!dragged && index !== activeIndex) goTo(index);
      });
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(activeIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(activeIndex + 1);
      }
    });

    viewport?.addEventListener('pointerdown', (event) => {
      pointerStart = event.clientX;
      dragged = false;
      stopAutoplay();
      viewport.setPointerCapture(event.pointerId);
    });

    viewport?.addEventListener('pointermove', (event) => {
      if (pointerStart === null) return;
      if (Math.abs(event.clientX - pointerStart) > 8) dragged = true;
    });

    const finishPointer = (event) => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 38) goTo(activeIndex + (distance < 0 ? 1 : -1));
      else startAutoplay();
      window.setTimeout(() => { dragged = false; }, 0);
    };

    viewport?.addEventListener('pointerup', finishPointer);
    viewport?.addEventListener('pointercancel', () => {
      pointerStart = null;
      dragged = false;
      startAutoplay();
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });

    render();
    startAutoplay();
  });

  const hero = document.querySelector('.hero__visual');
  if (!hero) return;

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    hero.style.transform = 'translate(0, 0)';
  });
})();
