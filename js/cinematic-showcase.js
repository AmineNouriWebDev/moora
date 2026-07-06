/**
 * MOORA MOTORS — Cinematic Showcase Script
 * Scroll-triggered motorcycle driving animation with stat counters
 */

(function () {
  'use strict';

  /* ── Config ────────────────────────────────────────── */
  const PANELS = [
    { id: 'panel-letbe',  idleDelay: 1800 },
    { id: 'panel-haojin', idleDelay: 1800 },
  ];

  /* ── Counter animation ─────────────────────────────── */
  function animateCounter(el) {
    const target  = parseFloat(el.dataset.count);
    const decimal = el.dataset.decimal || '';      // e.g. ".2" for 2.2
    const dur     = 900;                           // ms
    const start   = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // easeOutCubic
      const eased   = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      el.textContent = current + decimal;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + decimal;
    }

    requestAnimationFrame(step);
  }

  /* ── Activate panel ────────────────────────────────── */
  function activatePanel(panel, cfg) {
    if (panel.classList.contains('panel-active')) return;

    panel.classList.add('panel-active');

    // After the bike "drives in" (transition ~900ms), trigger brake bounce
    setTimeout(() => {
      panel.classList.add('panel-braking');
      setTimeout(() => panel.classList.remove('panel-braking'), 600);
    }, 900);

    // Animate counters
    panel.querySelectorAll('.panel-stat__value').forEach((el, i) => {
      setTimeout(() => animateCounter(el), 300 + i * 120);
    });

    // After the bike "stops", enter idle float
    setTimeout(() => {
      panel.classList.add('panel-idle');
    }, cfg.idleDelay);
  }

  /* ── IntersectionObserver ──────────────────────────── */
  const observerOptions = {
    root: null,
    threshold: 0.22,   // 22% of panel visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const panel = entry.target;
      const cfg   = PANELS.find(p => p.id === panel.id) || { idleDelay: 2000 };

      activatePanel(panel, cfg);
      // Stop observing once activated
      observer.unobserve(panel);
    });
  }, observerOptions);

  /* ── Init ──────────────────────────────────────────── */
  function init() {
    PANELS.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (el) observer.observe(el);
    });

    /* If a panel is already visible on page load (no scroll needed) */
    PANELS.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.78 && rect.bottom > 0;
      if (visible) activatePanel(el, cfg);
    });
  }

  /* ── Run after DOM ready ───────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Parallax subtle tilt on mouse move (desktop) ─── */
  if (!window.matchMedia('(max-width: 900px)').matches) {
    document.querySelectorAll('.moto-panel').forEach(panel => {
      const container = panel.querySelector('.moto-ride-container');
      if (!container) return;

      panel.addEventListener('mousemove', e => {
        if (!panel.classList.contains('panel-active')) return;
        const rect = panel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        // Subtle 3D tilt
        container.style.transform = `perspective(900px)
          rotateY(${x * 6}deg)
          rotateX(${-y * 3}deg)
          translateY(0px)`;
      });

      panel.addEventListener('mouseleave', () => {
        container.style.transform = '';
        container.style.transition = 'transform 0.6s ease';
        setTimeout(() => { container.style.transition = ''; }, 600);
      });
    });
  }

  /* ── "Re-ride" effect on scroll back into panel ─────
     Resets idle float so stats don't re-count
  */
})();
