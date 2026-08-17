/* ===========================
   HOME.JS — Carousel & Stats Counter
=========================== */

// ─── HORIZONTAL CAROUSEL ───
(function() {
  const track = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-track-container');
  const dots = document.querySelectorAll('.carousel-dot');
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');

  if (!track || !container) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let offset = 0;
  let currentIndex = 0;

  const cards = track.querySelectorAll('.carousel-card');
  const cardWidth = () => cards[0]?.offsetWidth + 24 || 280; // width + gap
  const maxOffset = () => -(cards.length * cardWidth() - container.offsetWidth - 40);

  function setOffset(val) {
    val = Math.max(maxOffset(), Math.min(0, val));
    offset = val;
    track.style.transform = `translateX(${val}px)`;
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(cards.length - 1, idx));
    currentIndex = idx;
    setOffset(-idx * cardWidth());
    updateDots();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  // Pointer events (mouse + touch)
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    currentX = e.clientX;
    track.style.transition = 'none';
    container.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - currentX;
    currentX = e.clientX;
    setOffset(offset + dx);
  });

  container.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    const totalDx = e.clientX - startX;
    if (Math.abs(totalDx) > 50) {
      currentIndex += totalDx < 0 ? 1 : -1;
    }
    goTo(currentIndex);
  });

  // Buttons
  btnPrev?.addEventListener('click', () => goTo(currentIndex - 1));
  btnNext?.addEventListener('click', () => goTo(currentIndex + 1));

  // Dot clicks
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play
  let autoPlay = setInterval(() => goTo(currentIndex + 1 >= cards.length ? 0 : currentIndex + 1), 4000);
  container.addEventListener('pointerdown', () => clearInterval(autoPlay));

  updateDots();
})();

// ─── STATS COUNT-UP ───
(function() {
  const statEls = document.querySelectorAll('[data-count]');
  if (!statEls.length) return;

  function animateCount(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.count;
      const suffix = el.dataset.suffix || '';
      animateCount(el, parseInt(raw), suffix);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => countObserver.observe(el));
})();
