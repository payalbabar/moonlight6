/**
 * StegoVault — UI Presentation Effects (Red & Black Cyber Theme)
 * Pure visual animations: Scroll-reveal, 3D tilt, cursor spotlight, stats count-up, scroll-progress bar.
 * ZERO business logic. Does not modify or intercept any application state or events.
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Scroll Progress Bar ──
  function initScrollProgress() {
    const bar = document.getElementById('sv-scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  // ── 2. Cursor Spotlight Glow (Ember / Red) ──
  function initCursorSpotlight() {
    if (isReducedMotion || window.innerWidth < 768) return;
    const glow = document.getElementById('sv-cursor-glow');
    if (!glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        glow.style.opacity = '1';
        isMoving = true;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
      isMoving = false;
    });

    function animateGlow() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      glow.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);
  }

  // ── 3. Navbar Shrink & Glow on Scroll ──
  function initNavbarScroll() {
    const nav = document.querySelector('.landing-nav') || document.querySelector('.sv-nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 30) {
        nav.classList.add('sv-nav--scrolled');
      } else {
        nav.classList.remove('sv-nav--scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 4. IntersectionObserver Scroll Reveal ──
  function initScrollReveal() {
    if (isReducedMotion) {
      document.querySelectorAll('.sv-reveal, .sv-reveal--stagger, .fade-in, .hero-content, .step-card, .feature-card, .faq-item, .spec-table-wrap, .calc-card, .lab-card, .standard-card').forEach(el => {
        el.classList.add('sv-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sv-revealed');
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    });

    document.querySelectorAll('.sv-reveal, .sv-reveal--stagger, .hero-content, .step-card, .feature-card, .faq-item, .spec-table-wrap, .calc-card, .lab-card, .standard-card, .comparison-table-wrap, .standards-grid').forEach(el => {
      observer.observe(el);
    });
  }

  // ── 5. 3D Tilt for Red Glass Cards with Dynamic Cursor Glow ──
  function initTiltCards() {
    if (isReducedMotion || window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.sv-card--tilt, .step-card, .feature-card, .spec-card, .standard-card, .calc-card, .circuit-stage-card, .wallet-card, .diff-stat-card');
    cards.forEach(card => {
      if (card.dataset.tiltInit) return;
      card.dataset.tiltInit = 'true';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ── 6. Count-up Stats Animation ──
  function initCountUpStats() {
    const statElements = document.querySelectorAll('.hero-stat-value, .sv-stat__value');
    if (!statElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);
          const el = entry.target;
          const targetText = el.getAttribute('data-count') || el.innerText.trim();
          
          const match = targetText.match(/^([^\d]*)(\d+(\.\d+)?)(.*)$/);
          if (match) {
            const prefix = match[1] || '';
            const num = parseFloat(match[2]);
            const isFloat = match[2].includes('.');
            const suffix = match[4] || '';
            const duration = 1400;
            const startTime = performance.now();

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const currentNum = num * ease;
              el.textContent = prefix + (isFloat ? currentNum.toFixed(2) : Math.floor(currentNum)) + suffix;

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = targetText;
              }
            }
            requestAnimationFrame(update);
          }
        }
      });
    }, { threshold: 0.15 });

    statElements.forEach(el => observer.observe(el));
  }

  // ── Master Init & Dynamic Re-run ──
  function initAll() {
    initScrollProgress();
    initCursorSpotlight();
    initNavbarScroll();
    initScrollReveal();
    initTiltCards();
    initCountUpStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Re-observe if dynamic routes or components mount
  const mutObserver = new MutationObserver(() => {
    initScrollReveal();
    initTiltCards();
    initNavbarScroll();
  });
  mutObserver.observe(document.body, { childList: true, subtree: true });

})();
