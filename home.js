// ===== Cart Helpers =====
function getCart() {
  let raw = localStorage.getItem('tz_cart');
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('tz_cart', JSON.stringify(cart));
}

// ===== Cart Count =====
function updateCartCount() {
  let cart = getCart();
  // Count total quantity, not just items
  let count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  $('#cart-count').text(count);
}

// ===== Navigation Visibility =====
function updateNavVisibility() {
  let raw = localStorage.getItem('user');
  let user = raw ? JSON.parse(raw) : { name: 'Guest' };
  let isLoggedIn = user.name && user.name !== 'Guest';

  // Toggle nav links
  $('a[href="login.html"]').toggleClass('hidden', isLoggedIn);
  $('#account-link').toggleClass('hidden', !isLoggedIn);
  $('.logout-btn').toggleClass('hidden', !isLoggedIn);

  // Show welcome message
  if (isLoggedIn) {
    $('#welcome-msg').text(`Welcome, ${user.name}`);
  } else {
    $('#welcome-msg').text('Welcome, Guest');
  }
}

// ===== Document Ready =====
$(document).ready(function () {
  // Update UI on load
  updateCartCount();
  updateNavVisibility();

  // Add to cart
  $('.add-to-cart').off('click.addToCart').on('click.addToCart', function () {
    let product = {
      id: $(this).data('id') || $(this).closest('.product-card').data('product-id'),
      name: $(this).data('name'),
      price: parseFloat($(this).data('price')),
      image: $(this).closest('.product-card').find('img').attr('src'),
      quantity: 1,
      size: 'M'
    };

    if (!product.name || isNaN(product.price)) return;

    let cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();

    // Animate cart badge
    $('#cart-count')
      .animate({ fontSize: '1.15rem' }, 120)
      .animate({ fontSize: '' }, 120);
  });

  // Logout
  $('.logout-btn').off('click.logout').on('click.logout', function (e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });

  // Logo click → home
  $('#logo-text').off('click.logo').on('click.logo', function () {
    window.location.href = 'home.html';
  });
});