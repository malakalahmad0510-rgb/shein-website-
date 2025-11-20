const categoriesEl = document.getElementById('categories');
const chips = Array.from(document.querySelectorAll('.chip'));
const searchInput = document.getElementById('q');

let allProducts = [];
let activeFilter = 'all';

async function loadProducts() {
  try {
    const res = await fetch('products.json');
    allProducts = await res.json();
    renderProducts(allProducts);
    setupChips();
    setupSearch();
  } catch (err) {
    console.error('Failed to load products.json', err);
    categoriesEl.innerHTML = '<p style="color:red">Could not load products.</p>';
  }
}

function renderProducts(products) {
  categoriesEl.innerHTML = '';
  if (!products.length) {
    categoriesEl.innerHTML = '<p>No products found.</p>';
    return;
  }

  const svgFallback = 'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23ffb6d6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">Image</text></svg>');

  products.forEach(p => {
    const article = document.createElement('article');
    article.className = 'category-card';
    article.dataset.category = p.category;

    article.innerHTML = `
      <div class="img-wrap">
        <img src="${escapeHtml(p.image || '')}" alt="${escapeHtml(p.name)}">
      </div>
      <div class="card-body">
        <h4>${escapeHtml(p.name)}</h4>
        <p class="price">$${Number(p.price).toFixed(2)}</p>
        <p class="desc">${escapeHtml(p.description)}</p>
        <a href="#" class="cat-cta">View</a>
      </div>
    `;

    // image fallback if broken
    const img = article.querySelector('img');
    if (img) {
      img.onerror = () => { img.src = svgFallback; img.style.objectFit = 'cover'; };
      // if empty src (no path) set fallback immediately
      if (!img.src || img.src.trim() === '') img.src = svgFallback;
    }

    categoriesEl.appendChild(article);
  });
}

function setupChips() {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter || 'all';
      applyFilters();
    });
  });
}

function setupSearch() {
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
}

function applyFilters() {
  const q = (searchInput.value || '').trim().toLowerCase();
  const filtered = allProducts.filter(p => {
    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchesQuery = !q || (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
    return matchesCategory && matchesQuery;
  });
  renderProducts(filtered);
}

/* small html-escape helper for safety */
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

loadProducts();