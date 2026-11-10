'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const heroPhoto = document.querySelector('.hero-picture img');
  let observer;
  let ticking = false;
  let photoAnimated = false;
  function onFrame() {
    ticking = false;
    const position = window.scrollY;
    const total = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('has-scrolled', position > 40);
    progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, position / Math.max(total, 1))) + ')';
    if (!reduced.matches && photoAnimated && innerWidth > 1000) {
      const y = Math.min(20, Math.max(0, position * .035));
      heroPhoto.style.setProperty('--photo-shift', y + 'px');
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  function disableReveal() {
    if (observer) observer.disconnect();
    document.body.classList.remove('motion-ready');
    document.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
    heroPhoto.classList.remove('parallax-ready');
  }
  function initialiseMotion() {
    if (reduced.matches || !('IntersectionObserver' in window)) { disableReveal(); return; }
    document.body.classList.add('motion-ready');
    try {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }, { threshold: .06, rootMargin: '0px 0px -25px 0px' });
      const groups = ['.section-heading','.service-card','.service-bottom','.style-main','.style-controls','.service-dock','.brand-promise','.about-visual','.about-copy','.process-grid article','.area-grid>div','.faq-grid>div','.contact-intro','.form-panel','.footer-statement'];
      document.querySelectorAll(groups.join(',')).forEach((el, index) => {
        const bounds = el.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top < innerHeight * .9) return;
        el.style.setProperty('--reveal-delay', el.matches('.service-card,.process-grid article') ? ((index % 3) * 90) + 'ms' : '0ms');
        el.classList.add('reveal-pending');
        observer.observe(el);
      });
      // Anchored/keyboard navigation reveals the destination immediately.
      function revealTarget() {
        const id = location.hash.slice(1);
        const target = id && document.getElementById(id);
        if (target) target.querySelectorAll('.reveal-pending').forEach(el => el.classList.add('is-visible'));
      }
      addEventListener('hashchange', revealTarget);
      revealTarget();
    } catch (_) { disableReveal(); }
  }
  heroPhoto.addEventListener('animationend', () => {
    if (reduced.matches || innerWidth <= 1000) return;
    photoAnimated = true; heroPhoto.classList.add('parallax-ready'); onFrame();
  }, { once: true });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  reduced.addEventListener('change', () => { if (reduced.matches) disableReveal(); else initialiseMotion(); onFrame(); });
  initialiseMotion(); onFrame();
})();
