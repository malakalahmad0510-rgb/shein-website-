$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem('user')) || {};
  if (!user.name) {
    window.location.href = 'login.html';
    return;
  }

  const $view = $('#profile-view');
  const $form = $('#profile-form');
  const $editBtn = $('#edit-btn');

  function fillView() {
    $('#view-name').text(user.name || '');
    $('#view-email').text(user.email || '');
    $('#view-phone').text(`Phone: ${user.phone || ''}`);
    $('#view-age').text(`Age: ${user.age || ''}`);
    $('#view-address').text(`Address: ${user.address || ''}`);
    $('#view-size').text(`Size: ${user.size || ''}`);
    $('#view-shoe-size').text(`Shoe Size: ${user.shoeSize || ''}`);

    $('#cart-count').text(user.cart?.length || 0);
    $('#cart-count-display').text(user.cart?.length || 0);
    $('#order-count').text(user.orders || 0);
    $('#favorites-count').text(user.favorites || 0);
  }

  function fillForm() {
    $('#name').val(user.name || '');
    $('#email').val(user.email || '');
    $('#phone').val(user.phone || '');
    $('#age').val(user.age || '');
    $('#address').val(user.address || '');
    $('#size').val(user.size || '');
    $('#shoe-size').val(user.shoeSize || '');
  }

  fillView();
  fillForm();

  $editBtn.on('click', function () {
    $('#profile-box').addClass('hidden');
    $form.removeClass('hidden');
  });

  $form.on('submit', function (e) {
    e.preventDefault();

    user = {
      ...user,
      name: $('#name').val().trim(),
      email: $('#email').val().trim(),
      phone: $('#phone').val().trim(),
      age: $('#age').val().trim(),
      address: $('#address').val().trim(),
      size: $('#size').val().trim(),
      shoeSize: $('#shoe-size').val().trim(),
    };

    localStorage.setItem('user', JSON.stringify(user));
    fillView();

    alert('Profile updated!');
    $form.addClass('hidden');
    $('#profile-box').removeClass('hidden');
  });
});