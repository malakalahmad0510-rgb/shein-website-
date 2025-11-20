$(document).ready(function () {
  let $loginForm = $('#login-form');
  let $signupForm = $('#signup-form');
  let $errorMsg = $('#login-error');

  // Sign Up
  $signupForm.on('submit', function (e) {
    e.preventDefault();

    let name = $('#signup-name').val().trim();
    let email = $('#signup-email').val().trim();
    let password = $('#signup-password').val().trim();

    if (name && email && password) {
      let user = {
        name: name,
        email: email,
        password: password,
        age: '',
        height: '',
        weight: '',
        size: '',
        orders: 0,
        favorites: 0,
        cart: []
      };

      localStorage.setItem('user', JSON.stringify(user));
      $signupForm[0].reset();
      alert('Account created! You can now log in.');
    }
  });

  // Login
  $loginForm.on('submit', function (e) {
    e.preventDefault();

    let email = $('#login-email').val().trim();
    let password = $('#login-password').val().trim();
    let storedUser = JSON.parse(localStorage.getItem('user'));

    $errorMsg.text(''); // Clear previous error

    if (!storedUser || storedUser.email !== email) {
      $errorMsg.text('No account found with this email.');
      return;
    }

    if (storedUser.password !== password) {
      $errorMsg.text('Incorrect password. Please try again.');
      return;
    }

    window.location.href = 'account.html';
  });
});