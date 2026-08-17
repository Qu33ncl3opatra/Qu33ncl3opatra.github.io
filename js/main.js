/* ===========================
   MAIN.JS — Shared: Nav, Sprinkles, Scroll Reveals
=========================== */

// ─── NAV ACTIVE LINK ───
(function() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ─── MOBILE HAMBURGER MENU ───
const hamburger = document.getElementById('nav-hamburger');
const navMobile = document.getElementById('nav-mobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
    }
  });
  // Close on nav link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
    });
  });
}

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ─── SPRINKLE CANVAS ───
const canvas = document.getElementById('sprinkle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const SPRINKLE_COLORS = [
  '#FBB5BF', '#910000', '#F8F6EA', '#FFD700', '#FF69B4',
  '#87CEEB', '#98FB98', '#DDA0DD', '#FFA07A', '#20B2AA'
];

const SPRINKLE_COUNT = 80;
let sprinkles = [];
let sprinkleActive = false;
let animFrame;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createSprinkle() {
  const size = Math.random() * 8 + 5;
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * -200 - 20,
    vx: (Math.random() - 0.5) * 1.2,
    vy: Math.random() * 2 + 1.2,
    angle: Math.random() * Math.PI * 2,
    vAngle: (Math.random() - 0.5) * 0.12,
    w: size * 3,
    h: size,
    color: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)],
    opacity: Math.random() * 0.5 + 0.5,
  };
}

function initSprinkles() {
  sprinkles = Array.from({ length: SPRINKLE_COUNT }, createSprinkle);
}

function drawSprinkle(s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.angle);
  ctx.globalAlpha = s.opacity;
  ctx.fillStyle = s.color;
  const rx = s.w / 2, ry = s.h / 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animateSprinkles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sprinkles.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    s.angle += s.vAngle;
    if (s.y > canvas.height + 20) {
      Object.assign(s, createSprinkle());
    }
    drawSprinkle(s);
  });
  animFrame = requestAnimationFrame(animateSprinkles);
}

function startSprinkles() {
  if (sprinkleActive) return;
  sprinkleActive = true;
  canvas.classList.add('active');
  initSprinkles();
  animateSprinkles();
}

function stopSprinkles() {
  if (!sprinkleActive) return;
  sprinkleActive = false;
  canvas.classList.remove('active');
  cancelAnimationFrame(animFrame);
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Hero scroll trigger (home page)
const heroBg = document.querySelector('.hero-bg');
if (heroBg && canvas) {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.6), 1);
        heroBg.style.opacity = 1 - progress;

        if (progress > 0.3 && !sprinkleActive) startSprinkles();
        if (progress < 0.1 && sprinkleActive) stopSprinkles();
        ticking = false;
      });
      ticking = true;
    }
  });
} else if (canvas) {
  // Non-home pages: always show subtle sprinkles
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  setTimeout(startSprinkles, 500);
}

// ─── FOOTER YEAR ───
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
