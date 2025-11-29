// ===== User Helpers =====
function getUser() {
  let raw = localStorage.getItem('user');
  try {
    return raw ? JSON.parse(raw) : { name: 'Guest', cart: [] };
  } catch {
    return { name: 'Guest', cart: [] };
  }
}

function saveUser(u) {
  localStorage.setItem('user', JSON.stringify(u));
}

// ===== Cart Count =====
function updateCartCount() {
  let user = getUser();
  let count = Array.isArray(user.cart) ? user.cart.length : 0;
  $('#cart-count').text(count);
}

// ===== Navigation Visibility =====
function updateNavVisibility(user) {
  let isLoggedIn = user.name && user.name !== 'Guest';

  // Toggle buttons
  $('a[href="login.html"]').toggleClass('hidden', isLoggedIn);
  $('#account-link').toggleClass('hidden', !isLoggedIn);
  $('.logout-btn').toggleClass('hidden', !isLoggedIn);
}

// ===== Document Ready =====
$(document).ready(function () {
  let user = getUser();
  if (!Array.isArray(user.cart)) user.cart = [];
  saveUser(user);

  // Update UI
  updateCartCount();
  updateNavVisibility(user);

  // Add to cart
  $('.add-to-cart').off('click.addToCart').on('click.addToCart', function () {
    let productName = $(this).data('name');
    let productPrice = parseFloat($(this).data('price'));
    if (!productName || isNaN(productPrice)) return;

    let currentUser = getUser();
    currentUser.cart.push({ name: productName, price: productPrice });
    saveUser(currentUser);
    updateCartCount();

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