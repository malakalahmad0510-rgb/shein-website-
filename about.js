// About page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart count from localStorage if available
  let cartCount = localStorage.getItem('cartCount') || 0;
  document.getElementById('cart-count').textContent = cartCount;

  // Add smooth scrolling for anchor links if any
  let anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      let targetId = this.getAttribute('href').substring(1);
      let targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Add animation to value cards on scroll
  let valueCards = document.querySelectorAll('.value-card');
  let observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  valueCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Add hover effects for interactive elements
  let navLinks = document.querySelectorAll('.nav-btn');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Add click tracking for navigation (optional analytics)
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log(`Navigating to: ${this.textContent}`);
      // Here you could add analytics tracking
    });
  });

  // Handle cart icon click
  let cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      // Here you could redirect to cart page or show cart modal
      console.log('Cart clicked');
    });
  }

  // Add loading animation for images
  let images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
  });

  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close any open modals or go back
      console.log('Escape pressed');
    }
  });

  // Add touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    let swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - could navigate to next section
      console.log('Swipe left');
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - could navigate to previous section
      console.log('Swipe right');
    }
  }

  // Add performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', function() {
      let perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
  }

  // Add error handling
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Here you could send error reports to a logging service
  });

  // Add service worker registration for PWA capabilities (if needed)
  if ('serviceWorker' in navigator) {
    // Uncomment and modify for PWA
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('SW registered'))
    //   .catch(err => console.log('SW registration failed'));
  }

  console.log('About page JavaScript loaded successfully');
});