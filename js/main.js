document.addEventListener('DOMContentLoaded', () => {

  // =====================================================
  // AOS Initialization
  // =====================================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 0,
    });
  }

  // =====================================================
  // Hero Video — Force Play (file:// protocol fix)
  // =====================================================
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    // Force load and play
    heroVideo.load();
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — try on first user interaction
        const triggerPlay = () => {
          heroVideo.play().catch(() => {});
          document.removeEventListener('click', triggerPlay);
          document.removeEventListener('scroll', triggerPlay);
          document.removeEventListener('touchstart', triggerPlay);
        };
        document.addEventListener('click', triggerPlay, { once: true });
        document.addEventListener('scroll', triggerPlay, { once: true });
        document.addEventListener('touchstart', triggerPlay, { once: true });
      });
    }

    // If moora.mp4 fails to load, fall back to presentation video
    heroVideo.addEventListener('error', () => {
      const currentSrc = heroVideo.currentSrc || '';
      if (currentSrc.includes('moora.mp4') || heroVideo.networkState === 3) {
        heroVideo.src = 'img/presentation-societe-moora.mp4';
        heroVideo.load();
        heroVideo.play().catch(() => {});
      }
    }, true);
  }

  // =====================================================
  // Navbar Scroll Effect
  // =====================================================
  const header = document.querySelector('header');
  if (header && !header.classList.contains('scrolled')) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // =====================================================
  // Mobile Menu Toggle
  // =====================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navDropdowns = document.querySelectorAll('.nav-item-dropdown');
  const mobileCloseLi = document.querySelector('.mobile-close-li');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');

  function openMenu() {
    navMenu.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    if (mobileCloseLi) mobileCloseLi.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    if (mobileCloseLi) mobileCloseLi.style.display = 'none';
    document.body.style.overflow = '';
    // Reset dropdowns
    navDropdowns.forEach(d => d.classList.remove('active'));
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMenu);
  }

  // Close menu if clicking the backdrop (::before pseudo)
  if (navMenu) {
    navMenu.addEventListener('click', (e) => {
      if (e.target === navMenu) closeMenu();
    });
  }

  navDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      }
    });
  });

  // Dark mode toggle removed — site is always in dark mode.

  // =====================================================
  // Color Selector (image swap with crossfade)
  // =====================================================
  const colorDots = document.querySelectorAll('.color-dot');
  colorDots.forEach(dot => {
    dot.addEventListener('click', function () {
      const parent = this.closest('.color-selector');
      parent.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      this.classList.add('active');

      const imgPath = this.getAttribute('data-image');
      const targetId = this.getAttribute('data-target');
      const imgElement = document.getElementById(targetId);

      if (imgPath && imgElement) {
        imgElement.style.opacity = '0';
        imgElement.style.transform = 'scale(0.97)';
        setTimeout(() => {
          imgElement.src = imgPath;
          imgElement.style.opacity = '1';
          imgElement.style.transform = 'scale(1)';
        }, 280);
      }
    });
  });

  // =====================================================
  // Animated Stat Counters
  // =====================================================
  function animateCounter(el, target, suffix = '', duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('fr-FR') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Observe stat numbers and trigger when visible
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }

  // =====================================================
  // Hero Canvas Particles
  // =====================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
        // Mix of red and cyan particles
        this.color = Math.random() > 0.7
          ? `rgba(0, 212, 255, ${this.alpha})`
          : `rgba(255, 30, 58, ${this.alpha})`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create 60 particles
    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 30, 58, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrame = requestAnimationFrame(animate);
    }

    animate();

    // Pause when hero is not visible (perf optimization)
    if ('IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!animFrame) animate();
        } else {
          cancelAnimationFrame(animFrame);
          animFrame = null;
        }
      }, { threshold: 0.1 });
      heroObs.observe(canvas.parentElement);
    }
  }

  // =====================================================
  // Smooth image transition style
  // =====================================================
  document.querySelectorAll(
    '.main-image, #letbe-main-img, #haojin-main-img, #letbe-showcase-img, #haojin-showcase-img, .showcase-moto-img'
  ).forEach(img => {
    img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

});
