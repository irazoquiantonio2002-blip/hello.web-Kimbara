/* KIMBARA — interacciones del sitio */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Loader ─────────────────────────────────────── */
  var loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loader) loader.classList.add('loaded');
    }, 500);
  });

  /* ── Navbar scroll state ────────────────────────── */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ── Hamburger / mobile menu ────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Reveal on scroll ────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── Marquee content ─────────────────────────────── */
  var marquee = document.getElementById('marquee');
  if (marquee) {
    var items = [
      'Snorkel con Tortugas', 'Club de Playa', 'Zona Arqueológica Maya',
      'Guías Locales', 'Grupos Reducidos', 'Costa Maya · Mahahual'
    ];
    var html = items.map(function (t) {
      return '<span><i class="fa-solid fa-water"></i>' + t + '</span>';
    }).join('');
    marquee.innerHTML = html + html; // duplicado para el loop continuo
  }

  /* ── Stat counters ───────────────────────────────── */
  var statNums = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statObserver.observe(el); });
  } else {
    statNums.forEach(animateCount);
  }

  /* ── Hero canvas — partículas flotantes ─────────── */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var particles = [];
    var colors = ['rgba(94,234,212,0.55)', 'rgba(243,196,106,0.5)', 'rgba(247,250,249,0.35)'];

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function makeParticles() {
      var count = Math.max(18, Math.round(canvas.width / 70));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2.2 + 0.8,
          vy: Math.random() * 0.35 + 0.1,
          vx: (Math.random() - 0.5) * 0.2,
          color: colors[i % colors.length],
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    resize();
    makeParticles();
    requestAnimationFrame(tick);
    window.addEventListener('resize', function () { resize(); makeParticles(); });
  }

  /* ── Formulario → WhatsApp ──────────────────────── */
  var waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name').value.trim();
      var interest = document.getElementById('f-interest').value;
      var msg = document.getElementById('f-msg').value.trim();

      var text = 'Hola, soy ' + name + '. Me interesa: ' + interest + '.';
      if (msg) text += ' ' + msg;

      var url = 'https://wa.me/529831269118?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ── Año del footer ──────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
