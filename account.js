$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  let $view = $('#profile-view');
  let $form = $('#profile-form');
  let $editBtn = $('#edit-btn');

  // Fill view mode
  $('#view-name').text(user.name || '');
  $('#view-email').text(user.email || '');
  $('#view-age').text(`Age: ${user.age || ''}`);
  $('#view-gender').text(`Gender: ${user.gender || ''}`);
  $('#view-phone').text(`Phone: ${user.phone || ''}`);
  $('#view-address').text(`Address: ${user.address || ''}`);
  $('#view-size').text(`Size: ${user.size || ''}`);
  $('#cart-count').text(user.cart?.length || 0);
  $('#order-count').text(user.orders || 0);
  $('#favorites-count').text(user.favorites || 0);

  // Fill form fields
  $('#name').val(user.name || '');
  $('#email').val(user.email || '');
  $('#age').val(user.age || '');
  $('#gender').val(user.gender || '');
  $('#phone').val(user.phone || '');
  $('#address').val(user.address || '');
  $('#size').val(user.size || '');

  
  $editBtn.on('click', function () {
    $view.addClass('hidden');
    $form.removeClass('hidden');
  });

  // Save changes
  $form.on('submit', function (e) {
    e.preventDefault();

    user.name = $('#name').val().trim();
    user.email = $('#email').val().trim();
    user.age = $('#age').val().trim();
    user.gender = $('#gender').val().trim();
    user.phone = $('#phone').val().trim();
    user.address = $('#address').val().trim();
    user.size = $('#size').val().trim();

    localStorage.setItem('user', JSON.stringify(user));
    alert('Profile updated!');
    location.reload();
  });
});