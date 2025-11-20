document.addEventListener('DOMContentLoaded', function () {
  let loginForm = document.getElementById('login-form');
  let signupForm = document.getElementById('signup-form');
  let errorMsg = document.getElementById('login-error');

  function getUsers() {
    let raw = localStorage.getItem('users');
    let users = [];
    try {
      users = raw ? JSON.parse(raw) : [];
    } catch {
      users = [];
    }
    return users;
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function setCurrentUser(user) {
    if (!Array.isArray(user.cart)) {
      user.cart = [];
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let name = document.getElementById('signup-name').value.trim();
      let email = document.getElementById('signup-email').value.trim().toLowerCase();
      let password = document.getElementById('signup-password').value.trim();
      let phone = document.getElementById('signup-phone').value.trim();

      if (!name || !email || !password || !phone) {
        alert('Please fill in all fields.');
        return;
      }

      let users = getUsers();
      let exists = users.find(function (u) {
        return u.email === email;
      });

      if (exists) {
        alert('An account with this email already exists.');
        return;
      }

      let newUser = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        age: '',
        height: '',
        weight: '',
        size: '',
        orders: 0,
        favorites: 0,
        cart: []
      };

      users.push(newUser);
      saveUsers(users);
      signupForm.reset();
      alert('Account created! You can now log in.');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let email = document.getElementById('login-email').value.trim().toLowerCase();
      let password = document.getElementById('login-password').value.trim();
      let users = getUsers();

      if (errorMsg) errorMsg.textContent = '';

      let user = users.find(function (u) {
        return u.email === email;
      });

      if (!user) {
        if (errorMsg) errorMsg.textContent = 'No account found with this email.';
        return;
      }

      if (user.password !== password) {
        if (errorMsg) errorMsg.textContent = 'Incorrect password. Please try again.';
        return;
      }

      setCurrentUser(user);
      window.location.href = 'account.html';
    });
  }
});