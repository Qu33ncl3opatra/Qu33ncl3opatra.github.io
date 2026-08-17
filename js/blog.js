/* ===========================
   BLOG.JS — Search, Categories, Read-More Modal
=========================== */

// ─── BLOG DATA ───
const BLOG_DATA = [
  {
    id: 'customer',
    tag: 'Customer Spotlight',
    title: 'Customer of the Month: Margaret\'s Sweet Celebrations',
    excerpt: 'Every birthday, anniversary, and neighbourhood bake sale — Margaret has been ordering from Wiggy Baking for over five years, and her community couldn\'t be more grateful.',
    author: '🎂', authorName: 'Wiggy Team', date: 'August 10, 2026',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    full: `<p>When we think of the heart of our community, we think of Margaret Chen. For the past five years, Margaret has placed an order with Wiggy Baking at least once a month — and every single time, it's for someone she loves.</p>
<p>It started with her daughter's seventh birthday: a pink three-tiered cake with hand-piped roses that made little Emma burst into tears of joy. Then came the neighbourhood bake sale where Margaret ordered 200 mini cupcakes to raise funds for the local library. After that, there was no going back.</p>
<p>"Wiggy Baking doesn't just make cakes," Margaret told us when we surprised her with a dedication plaque. "They make memories. Every time I open one of those boxes, I feel like someone truly cared about what was inside."</p>
<p>This month, Margaret placed her biggest order yet — a towering five-tier wedding cake for her eldest son, decorated with fresh raspberry coulis and edible gold leaf. We were honoured to be part of such a beautiful milestone.</p>
<p>To Margaret, and to every loyal customer who has made Wiggy Baking a part of their celebrations: thank you. You are the reason we bake.</p>`
  },
  {
    id: 'employee',
    tag: 'Team Spotlight',
    title: 'Baker of the Month: James and the Midnight Macaron',
    excerpt: 'Late nights, thousands of shells, and an unshakeable belief that the perfect macaron exists — meet James, our fearless Pastry Specialist.',
    author: '👩‍🍳', authorName: 'Editorial Team', date: 'August 5, 2026',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    full: `<p>James Okafor joined Wiggy Baking three years ago with a dog-eared copy of a French pâtisserie textbook and a dream: to make the perfect macaron. Most people would have given up after the first hundred failed batches. James is not most people.</p>
<p>"The shell has to sing," he explains, tapping a golden almond shell against the worktop to demonstrate that hollow crunch. "If it doesn't make that sound, we start again."</p>
<p>His dedication paid off spectacularly when his lavender and Earl Grey macarons sold out in under 40 minutes at the Wiggy summer pop-up market. Customer reviews flooded in — one person drove 60 miles specifically because a friend had mentioned them.</p>
<p>This month, James introduced our limited-edition "Sunrise Collection": yuzu curd, blood orange, and toasted sesame macarons that have already become our fastest-selling product ever.</p>
<p>James, your creativity and relentless pursuit of perfection make every day in the kitchen a little more magical. We are so proud to have you on our team.</p>`
  },
  {
    id: 'mishap',
    tag: 'Kitchen Tales',
    title: 'The Great Ganache Incident (Or: How We Found Our Best Seller)',
    excerpt: 'It started as a classic chocolate fudge cake. It ended as a kitchen covered in ganache — and one very happy accident that changed our menu forever.',
    author: '😂', authorName: 'Sarah W.', date: 'July 28, 2026',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80',
    full: `<p>We don't talk about The Ganache Incident often. Partly because it's embarrassing. Mostly because, if we're honest, it still makes us laugh until we cry.</p>
<p>It was a Tuesday afternoon in February. Our head baker, Priya, was making a particularly ambitious dark chocolate ganache — the kind that requires precise temperature control and absolute concentration. The phone rang. Priya reached for it. Her elbow reached for the bowl of ganache.</p>
<p>What followed was approximately three seconds of slow-motion horror, two shrieks, and roughly four kilograms of warm ganache distributed across the kitchen ceiling, three walls, Priya's apron, and — somehow — the fire extinguisher.</p>
<p>The cake order was saved (barely). The cleanup took two hours. But in scraping the walls, Priya noticed something: where the ganache had hit the cold tiles and instantly set, it formed these incredibly rustic, beautifully imperfect chocolate shards.</p>
<p>"Wait," she said, staring at the wall. "These are gorgeous."</p>
<p>Three weeks later, our Ganache Shard Cake — a rich chocolate fudge base topped with hand-broken dark chocolate bark — became our most-ordered cake of 2025. It's now a permanent fixture on the menu.</p>
<p>The moral of the story: always answer the phone away from the ganache. And never, ever assume a baking accident is a disaster until you've tasted it.</p>`
  }
];

// ─── RENDER BLOG POSTS ───
function renderBlogPosts(posts) {
  const featured = document.getElementById('blog-featured');
  const pair = document.getElementById('blog-pair');
  if (!featured || !pair) return;

  // Featured (first post)
  const fp = posts[0];
  featured.innerHTML = `
    <div class="blog-featured reveal" style="overflow:hidden; border-radius: var(--radius-md);">
      <img src="${fp.image}" alt="${fp.title}" style="width:100%;height:340px;object-fit:cover;">
      <div class="blog-featured-body">
        <span class="blog-tag">${fp.tag}</span>
        <h2 class="blog-title">${fp.title}</h2>
        <div class="blog-meta">
          <span class="blog-meta-avatar">${fp.author}</span>
          <span>${fp.authorName}</span>
          <span>·</span>
          <span>${fp.date}</span>
        </div>
        <p class="blog-excerpt">${fp.excerpt}</p>
        <button class="btn-primary" onclick="openModal('${fp.id}')">Read More →</button>
      </div>
    </div>`;

  // Pair (remaining posts)
  pair.innerHTML = posts.slice(1).map(p => `
    <div class="blog-card reveal">
      <img src="${p.image}" alt="${p.title}">
      <div class="blog-card-body">
        <span class="blog-tag">${p.tag}</span>
        <h3 class="blog-card-title">${p.title}</h3>
        <p class="blog-card-excerpt">${p.excerpt}</p>
        <button class="btn-secondary" onclick="openModal('${p.id}')" style="font-size:0.88rem;padding:0.5rem 1.2rem;">Read More →</button>
      </div>
    </div>`).join('');

  // Re-observe reveals
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver?.observe?.(el) || el.classList.add('visible');
  });
}

// ─── MODAL ───
window.openModal = function(id) {
  const post = BLOG_DATA.find(p => p.id === id);
  if (!post) return;
  document.getElementById('modal-title').textContent = post.title;
  document.getElementById('modal-body').innerHTML = post.full;
  document.getElementById('blog-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  document.getElementById('blog-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
};

document.getElementById('blog-modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ─── SEARCH ───
document.getElementById('blog-search-input')?.addEventListener('input', function() {
  const q = this.value.toLowerCase();
  const filtered = q
    ? BLOG_DATA.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    : BLOG_DATA;
  renderBlogPosts(filtered.length ? filtered : BLOG_DATA);
});

document.getElementById('blog-search-btn')?.addEventListener('click', () => {
  const q = document.getElementById('blog-search-input').value.toLowerCase();
  const filtered = q ? BLOG_DATA.filter(p => p.title.toLowerCase().includes(q)) : BLOG_DATA;
  renderBlogPosts(filtered.length ? filtered : BLOG_DATA);
});

// ─── CATEGORY FILTER ───
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.cat;
    const filtered = cat === 'all' ? BLOG_DATA : BLOG_DATA.filter(p => p.tag === cat);
    renderBlogPosts(filtered.length ? filtered : BLOG_DATA);
  });
});

// ─── INIT ───
renderBlogPosts(BLOG_DATA);
