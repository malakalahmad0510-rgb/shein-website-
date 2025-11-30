// Get DOM elements
const cartItemsEl = document.getElementById('cart-items');
const totalItemsEl = document.getElementById('total-items');
const cartCountEl = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('tz_cart')) || [];

// Initialize
function init() {
    renderCart();
    updateSummary();
      updateCartCount();
    createModalHTML();
}
function updateCartCount() {
  const raw = localStorage.getItem('tz_cart');
  const cart = raw ? JSON.parse(raw) : [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (cartCountEl) cartCountEl.textContent = count;
}


// Create Modal HTML (added once to DOM)
function createModalHTML() {
    if (document.getElementById('checkout-modal')) return;
    
    const modalHTML = `
        <div id="checkout-modal" class="modal" style="display: none;">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Order Summary</h2>
                    <button class="modal-close" onclick="closeCheckoutModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="modal-order-items"></div>
                    <div class="modal-divider"></div>
                    <div class="modal-summary">
                        <div class="summary-line">
                            <span>Subtotal:</span>
                            <span id="modal-subtotal">$0.00</span>
                        </div>
                        <div class="summary-line">
                            <span>Tax (8%):</span>
                            <span id="modal-tax">$0.00</span>
                        </div>
                        <div class="summary-line total">
                            <span>Total:</span>
                            <span id="modal-total">$0.00</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn cancel" onclick="closeCheckoutModal()">Cancel</button>
                    <button class="modal-btn confirm" onclick="confirmCheckout()">Confirm Payment</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
// Attach add-to-cart handler for all product cards
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = {
      id: btn.dataset.id || btn.closest('.product-card').dataset.productId,
      name: btn.dataset.name || btn.closest('.product-card').querySelector('h3').textContent,
      price: parseFloat(btn.dataset.price) || 0,
      image: btn.closest('.product-card').querySelector('img').src,
      quantity: 1,
      size: 'M'
    };

    cart.push(product);
    saveCart();
    renderCart();
    updateSummary();

    // Animate cart badge
    if (cartCountEl) {
      cartCountEl.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 200 });
    }
  });
});

// Open Checkout Modal
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Populate order items
    const itemsHTML = cart.map(item => `
        <div class="modal-item">
            <div class="item-name">${item.name}</div>
            <div class="item-details">${item.quantity}x • Size: ${item.size} • $${item.price.toFixed(2)}</div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    document.getElementById('modal-order-items').innerHTML = itemsHTML;
    document.getElementById('modal-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('modal-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('modal-total').textContent = `$${total.toFixed(2)}`;

    modal.style.display = 'flex';
}

// Close Checkout Modal
window.closeCheckoutModal = function () {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
};

// Confirm Checkout
window.confirmCheckout = function () {
    // Clear cart after successful checkout
    cart = [];
    saveCart();
    renderCart();
    updateSummary();
    
    closeCheckoutModal();
    
    // Show success message
    showSuccessModal();
};

// Success Modal
function showSuccessModal() {
    const successHTML = `
        <div id="success-modal" class="modal" style="display: flex;">
            <div class="modal-overlay"></div>
            <div class="modal-content success">
                <div class="success-icon">✓</div>
                <h2>Order Placed!</h2>
                <p>Thank you for your purchase!</p>
                <p class="muted">Your order has been confirmed and will be shipped soon.</p>
                <button class="modal-btn confirm" onclick="redirectToProducts()">Continue Shopping</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

// Redirect to Products
window.redirectToProducts = function () {
    const modal = document.getElementById('success-modal');
    if (modal) modal.remove();
    window.location.href = 'product.html';
};

// Render Cart Items
function renderCart() {
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
      <div class="empty-cart" style="text-align:center; padding: 40px;">
        <p>Your cart is empty.</p>
        <a href="product.html" class="primary" style="display:inline-block; margin-top:10px; text-decoration:none; padding:8px 16px; border-radius:8px; background:var(--pink-500); color:#fff;">Start Shopping</a>
      </div>
    `;
        return;
    }

    cart.forEach(item => {
        // Set default size if undefined
        if (!item.size) {
            item.size = 'M';
            saveCart();
        }

        const el = document.createElement('article');
        el.className = 'cart-item';
        el.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23eee\\'/></svg>'">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-meta">
          <label for="size-${item.id}">Size:</label>
          <select id="size-${item.id}" onchange="updateSize('${item.id}', this.value)" style="padding: 6px 10px; border: 2px solid #ffb6d6; border-radius: 6px; background-color: #fff; color: #333; font-weight: 500; cursor: pointer;">
            <option value="XS" ${item.size === 'XS' ? 'selected' : ''}>XS</option>
            <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
            <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
            <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
            <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
          </select>
        </div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
          <input type="text" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem('${item.id}')" style="background-color: #ffb6d6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.3s; text-decoration: none;">Remove</button>
      </div>
    `;
        cartItemsEl.appendChild(el);
    });
}

// Update Quantity
window.updateQuantity = function (id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        // If quantity goes below 1, confirm removal
        if (confirm('Remove this item from cart?')) {
            removeItem(id);
            return;
        } else {
            item.quantity = 1; // Revert to 1
        }
    }

    saveCart();
    renderCart();
    updateSummary();
};

// Remove Item
window.removeItem = function (id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    updateSummary();
};

// Update Size
window.updateSize = function (id, newSize) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.size = newSize;
        saveCart();
    }
};

// Update Summary Calculations
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // Mock 8% tax
    const total = subtotal + tax;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    totalItemsEl.textContent = totalItems;
    if (cartCountEl) cartCountEl.textContent = totalItems;
}

// Save to LocalStorage
function saveCart() {
    localStorage.setItem('tz_cart', JSON.stringify(cart));
}

// Checkout Function
window.checkout = function () {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    openCheckoutModal();
};

// Run
init();
