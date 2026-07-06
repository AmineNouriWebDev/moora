/**
 * MOORA MOTORS — Page Loader
 * Injects a full-screen loader on every page load, then fades it out.
 */
(function () {
  'use strict';

  /* ── 1. Build the loader DOM immediately (before DOMContentLoaded) ─ */
  const loader = document.createElement('div');
  loader.id = 'moora-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'Chargement…');

  loader.innerHTML = `
    <!-- Scan line -->
    <div class="loader-scanline" aria-hidden="true"></div>

    <!-- Corner brackets -->
    <div class="loader-corner loader-corner--tl" aria-hidden="true"></div>
    <div class="loader-corner loader-corner--tr" aria-hidden="true"></div>
    <div class="loader-corner loader-corner--bl" aria-hidden="true"></div>
    <div class="loader-corner loader-corner--br" aria-hidden="true"></div>

    <!-- Logo -->
    <div class="loader-logo-wrap">
      <img
        class="loader-logo"
        src="${getLogoPath()}img/logo.png"
        alt="Moora Motors"
        width="130"
        height="130"
      >
    </div>

    <!-- Brand name -->
    <div class="loader-brand">Moora Motors</div>

    <!-- Progress bar -->
    <div class="loader-progress-track" aria-hidden="true">
      <div class="loader-progress-fill"></div>
    </div>
  `;

  /* Insert as first element so it covers everything */
  document.documentElement.appendChild(loader);

  /* ── 2. Resolve logo path relative to current page depth ─────────── */
  function getLogoPath() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth > 0 ? '../'.repeat(depth) : '';
  }

  /* ── 3. Hide the loader after page is ready ───────────────────────── */
  const MIN_SHOW_MS = 1400;   // always show for at least this long
  const startTime   = Date.now();

  function hideLoader() {
    const elapsed  = Date.now() - startTime;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    setTimeout(() => {
      loader.classList.add('loader-hiding');

      /* After fade-out transition, remove from DOM entirely */
      loader.addEventListener('transitionend', () => {
        loader.classList.add('loader-gone');
        document.body.style.overflow = '';
      }, { once: true });
    }, remaining);
  }

  /* Freeze body scroll while loader is visible */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
  });

  /* Hide on window load (all resources ready) */
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });

    /* Safety fallback: hide after 4s even if load never fires */
    setTimeout(hideLoader, 4000);
  }
})();
