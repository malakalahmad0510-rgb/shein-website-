$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  
  if (!Array.isArray(user.cart)) {
    user.cart = [];
    localStorage.setItem('user', JSON.stringify(user));
  }

  
  let $brand = $('.brand');
  if ($brand.length && user.name) {
    let $welcome = $('<div class="welcome-msg"></div>');
    $welcome.text(`Welcome, ${user.name}!`);
    $brand.append($welcome);
  }

  
  function updateCartCount() {
    let updatedUser = JSON.parse(localStorage.getItem('user'));
    let count = updatedUser.cart?.length || 0;
    $('#cart-count').text(count);
  }

  updateCartCount();


  $('.add-to-cart').on('click', function () {
    let productName = $(this).data('name');
    let productPrice = parseFloat($(this).data('price'));


    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (!Array.isArray(currentUser.cart)) {
      currentUser.cart = [];
    }

    currentUser.cart.push({ name: productName, price: productPrice });
    localStorage.setItem('user', JSON.stringify(currentUser));

    updateCartCount();
  });

  
  let $logoutBtn = $('.logout-btn');
  if ($logoutBtn.length) {
    $logoutBtn.on('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  }

  
  let $logo = $('#logo-text');
  if ($logo.length) {
    $logo.on('click', function () {
      window.location.href = 'home.html';
    });
  }
});