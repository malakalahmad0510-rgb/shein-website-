const productDetailEl = document.getElementById('product-detail');

// Get product ID from URL parameters
function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Load and render product details
async function loadProductDetail() {
  const productId = getProductId();
  if (!productId) {
    productDetailEl.innerHTML = '<p style="color:red; text-align:center;">No product ID provided.</p>';
    return;
  }

  try {
    const res = await fetch('products.json');
    const products = await res.json();
    const product = products.find(p => p.id === productId);

    if (!product) {
      productDetailEl.innerHTML = '<p style="color:red; text-align:center;">Product not found.</p>';
      return;
    }

    renderProductDetail(product);
  } catch (err) {
    console.error('Failed to load product details', err);
    productDetailEl.innerHTML = '<p style="color:red; text-align:center;">Could not load product details.</p>';
  }
}

// Render product details
function renderProductDetail(product) {
  const svgFallback = 'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23ffb6d6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">Image</text></svg>');

  productDetailEl.innerHTML = `
    <div class="product-card">
      <div class="product-image">
        <img src="${escapeHtml(product.image || '')}" alt="${escapeHtml(product.name)}">
      </div>
      <div class="product-info">
        <h1 class="product-name">${escapeHtml(product.name)}</h1>
        <p class="product-price">$${Number(product.price).toFixed(2)}</p>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <p class="product-category">Category: ${escapeHtml(product.category)}</p>
        <a href="#" class="add-to-cart">Add to Cart</a>
      </div>
    </div>
  `;

  // Image fallback
  const img = productDetailEl.querySelector('img');
  if (img) {
    img.onerror = () => { img.src = svgFallback; img.style.objectFit = 'cover'; };
    if (!img.src || img.src.trim() === '') img.src = svgFallback;
  }
}

/* small html-escape helper for safety */
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

loadProductDetail();
