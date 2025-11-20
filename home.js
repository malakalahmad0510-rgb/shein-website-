$(document).ready(function () {
  
function getUser() {
  let raw = localStorage.getItem('user');
  try { return raw ? JSON.parse(raw) : { name: 'Guest', cart: [] }; }
  catch { return { name: 'Guest', cart: [] }; }
}

  function saveUser(u) {
    localStorage.setItem('user', JSON.stringify(u));
  }

  let user = getUser();
  if (!Array.isArray(user.cart)) user.cart = [];

  saveUser(user);

  
  let $brand = $('.brand');
  if ($brand.length && user.name) {
    
    if ($brand.find('.welcome-msg').length === 0) {
      let $welcome = $('<div class="welcome-msg" aria-hidden="true"></div>');
      $welcome.text(`Welcome, ${user.name}!`);
      $brand.append($welcome);
    }
  }

  
  function updateCartCount() {
    let updated = getUser();
    let count = Array.isArray(updated.cart) ? updated.cart.length : 0;
    $('#cart-count').text(count);
  }

  updateCartCount();

  
  $('.add-to-cart').off('click.addToCart').on('click.addToCart', function () {
    let productName = $(this).data('name');
    let productPrice = parseFloat($(this).data('price'));

    if (!productName || isNaN(productPrice)) {

      return;
    }

    let currentUser = getUser();
    if (!Array.isArray(currentUser.cart)) currentUser.cart = [];

    currentUser.cart.push({ name: productName, price: productPrice });
    saveUser(currentUser);

    updateCartCount();

    
    let $count = $('#cart-count');
    $count.animate({ fontSize: '1.15rem' }, 120).animate({ fontSize: '' }, 120);
  });


  let $logoutBtn = $('.logout-btn');
  if ($logoutBtn.length) {
    $logoutBtn.off('click.logout').on('click.logout', function (e) {
      e.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  }

  
  let $logo = $('#logo-text');
  if ($logo.length) {
    $logo.off('click.logo').on('click.logo', function () {
      window.location.href = 'home.html';
    });
  }
});