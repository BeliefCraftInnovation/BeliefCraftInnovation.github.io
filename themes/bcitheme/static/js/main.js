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
