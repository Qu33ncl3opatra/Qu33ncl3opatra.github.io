/* ===========================
   RECIPES.JS — Card Flip & Swipe
=========================== */

// ─── CARD FLIP ───
document.querySelectorAll('.recipe-card-wrap').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  // Keyboard accessibility
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Click to reveal recipe');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

// ─── KEYBOARD / SWIPE NAVIGATION BETWEEN CARDS ───
// On mobile, swiping up/down scrolls through cards smoothly — the grid handles this natively
// We add touch-snap enhancement:
(function() {
  let touchStartY = 0;
  const grid = document.querySelector('.recipes-grid');
  if (!grid) return;

  grid.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  grid.addEventListener('touchend', (e) => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 30) return;

    const cards = Array.from(grid.querySelectorAll('.recipe-card-wrap'));
    const viewMid = window.innerHeight / 2;
    let closest = 0, minDist = Infinity;
    cards.forEach((c, i) => {
      const rect = c.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - viewMid);
      if (dist < minDist) { minDist = dist; closest = i; }
    });

    const target = dy > 0 ? Math.min(closest + 1, cards.length - 1) : Math.max(closest - 1, 0);
    cards[target].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, { passive: true });
})();
