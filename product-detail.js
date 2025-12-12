const productDetailEl = document.getElementById('product-detail');
const cartCountEl = document.getElementById('cart-count');

// Load saved cart count on page load
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
cartCountEl.textContent = cartCount;

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

        <div class="product-actions">
          <label>Size:</label>
          <div class="size-options">
            ${(product.sizes || ['S','M','L','XL']).map(size =>
              `<button type="button" class="size-btn">${escapeHtml(size)}</button>`
            ).join('')}
          </div>

          

          <button class="btn add-to-cart">
            <i class="fa fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

// Handle size selection
document.addEventListener('click', e => {
  if (e.target.classList.contains('size-btn')) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// Handle Add to Cart
document.addEventListener('click', function (e) {
  if (e.target.closest('.add-to-cart')) {
    e.preventDefault();

    const name = document.querySelector('.product-name')?.textContent;
    const price = document.querySelector('.product-price')?.textContent;
    const size = document.querySelector('.size-btn.active')?.textContent || 'Not selected';
    const qty = parseInt(document.getElementById('quantity')?.value) || 1;

    // Update cart count
    cartCount += qty;
    cartCountEl.textContent = cartCount;
    localStorage.setItem('cartCount', cartCount);

    alert(`${name} added to cart!\nSize: ${size}\nQty: ${qty}\nTotal items: ${cartCount}`);
  }
});

/* small html-escape helper for safety */
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

loadProductDetail();