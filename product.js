const categoriesEl = document.getElementById('categories');
const chips = Array.from(document.querySelectorAll('.chip'));
const searchInput = document.getElementById('q');
const cartCountEl = document.getElementById('cart-count');

let allProducts = [];
let activeFilter = 'all';
let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];
let currentPage = 1;
const itemsPerPage = 8;

async function loadProducts() {
  try {
    const res = await fetch('products.json');
    allProducts = await res.json();
    currentPage = 1;
    renderProducts(allProducts);
    setupChips();
    setupSearch();
    updateCartCount();
  } catch (err) {
    console.error('Failed to load products.json', err);
    categoriesEl.innerHTML = '<p style="color:red">Could not load products.</p>';
  }
}

function renderProducts(products) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);

  categoriesEl.innerHTML = '';
  if (!products.length) {
    categoriesEl.innerHTML = '<p>No products found.</p>';
    renderPagination(products.length);
    return;
  }

  const svgFallback = 'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23ffb6d6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">Image</text></svg>');

  paginatedProducts.forEach(p => {
    const isInCart = cart.some(item => item.id === p.id);
    const btnText = isInCart ? 'In Cart' : 'Add to Cart';
    const btnClass = isInCart ? 'cat-cta in-cart' : 'cat-cta';

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
        <div class="card-actions">
          <button class="${btnClass}" data-id="${p.id}">${btnText}</button>
          <button class="cat-detail" data-id="${p.id}">Product Detail</button>
        </div>
      </div>
    `;

    const img = article.querySelector('img');
    if (img) {
      img.onerror = () => { img.src = svgFallback; img.style.objectFit = 'cover'; };
      if (!img.src || img.src.trim() === '') img.src = svgFallback;
    }

    const btn = article.querySelector('.cat-cta');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(p);
    });

    const detailBtn = article.querySelector('.cat-detail');
    detailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('View product detail:', p);
    
    });

    categoriesEl.appendChild(article);
  });

  renderPagination(products.length);
}

function renderPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const paginationContainer = document.getElementById('pagination') || createPaginationContainer();
  
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn';
  prevBtn.textContent = '← Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
      scrollToCategory();
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      applyFilters();
      scrollToCategory();
    });
    paginationContainer.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
      scrollToCategory();
    }
  });
  paginationContainer.appendChild(nextBtn);
}

function scrollToCategory() {
  const categoryHeader = document.querySelector('.categories-header');
  if (categoryHeader) {
    categoryHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function createPaginationContainer() {
  const container = document.createElement('div');
  container.id = 'pagination';
  container.className = 'pagination';
  const productsWrap = document.querySelector('.products-wrap');
  productsWrap.appendChild(container);
  return container;
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    window.location.href = 'cart.html';
    return;
  }

  cart.push({
    ...product,
    quantity: 1
  });

  saveCart();
  updateCartCount();

  const btn = document.querySelector(`button[data-id="${product.id}"]`);
  if (btn) {
    btn.textContent = 'In Cart';
    btn.classList.add('in-cart');
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (cartCountEl) cartCountEl.textContent = count;
}

function saveCart() {
  localStorage.setItem('tz_cart', JSON.stringify(cart));
}

function setupChips() {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter || 'all';
      currentPage = 1;
      applyFilters();
    });
  });
}

function setupSearch() {
  if (!searchInput) return;
  const clearBtn = document.getElementById('search-clear');
  searchInput.addEventListener('input', () => {
    if (clearBtn) clearBtn.hidden = !searchInput.value;
    currentPage = 1;
    applyFilters();
  });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.hidden = true;
      currentPage = 1;
      applyFilters();
      searchInput.focus();
    });
  }
}

function applyFilters() {
  const q = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
  const filtered = allProducts.filter(p => {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchesQuery = !q || name.includes(q) || desc.includes(q) || id.includes(q);
    return matchesCategory && matchesQuery;
  });
  renderProducts(filtered);
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

loadProducts();