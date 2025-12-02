const products = [
  {
    id: 'p1',
    name: 'Pink Dress',
    price: '$19.87',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    description: 'Winter pink and white long dress, perfect for special occasions',
    fullDescription: 'This stunning pink and white long dress is the perfect addition to your evening wardrobe. With its elegant design and comfortable fit, you\'ll feel confident and beautiful at any special event. The soft fabric drapes beautifully and the color is absolutely gorgeous.',
    features: [
      'Premium soft cotton blend fabric',
      'Perfect for winter events and parties',
      'True to size fit',
      'Easy care and maintenance',
      'Elegant white and pink color combination'
    ]
  },
  {
    id: 'p2',
    name: 'Pink Handbag',
    price: '$12.69',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=500&fit=crop',
    description: 'Soft pink leather handbag with gold accents',
    fullDescription: 'This compact yet spacious handbag is the perfect everyday essential. Crafted from soft pink leather with beautiful gold accents, it adds a touch of elegance to any outfit while remaining practical for daily use.',
    features: [
      'Premium leather construction',
      'Gold-tone hardware accents',
      'Spacious interior pockets',
      'Adjustable shoulder strap',
      'Lightweight and durable'
    ]
  },
  {
    id: 'p3',
    name: 'Denim Jacket',
    price: '$32.78',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    description: 'Light blue denim jacket with patch details',
    fullDescription: 'This stylish light blue denim jacket is a wardrobe must-have. With unique patch details and quality construction, it\'s perfect for layering over dresses or pairing with jeans for a complete look.',
    features: [
      'Quality denim material',
      'Unique patch design details',
      'Perfect for layering',
      'Season-appropriate weight',
      'Versatile light blue color'
    ]
  },
  {
    id: 'p4',
    name: 'Gold Hoop Earrings',
    price: '$6.56',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop',
    description: 'Classic gold hoop earrings, lightweight and elegant',
    fullDescription: 'These timeless gold hoop earrings are the perfect everyday accessory. Lightweight and elegantly designed, they complement any outfit and add a touch of sophistication to your look.',
    features: [
      'Classic hoop design',
      'Lightweight for all-day wear',
      'Gold-tone finish',
      'Hypoallergenic materials',
      'Perfect for any occasion'
    ]
  },
  {
    id: 'p5',
    name: 'Floral Skirt',
    price: '$24.99',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop',
    description: 'Flowy floral print midi skirt, perfect for spring',
    fullDescription: 'Bring spring vibes to your wardrobe with this beautiful floral print midi skirt. The flowy design and vibrant colors make it perfect for warm weather styling.',
    features: [
      'Vibrant floral print',
      'Comfortable flowy fit',
      'Midi length design',
      'Breathable cotton fabric',
      'Pairs well with any top'
    ]
  },
  {
    id: 'p6',
    name: 'White Sneakers',
    price: '$45.00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    description: 'Classic white sneakers with pink accents',
    fullDescription: 'These classic white sneakers with pink accents are the perfect blend of comfort and style. Suitable for casual outings, workouts, or everyday wear.',
    features: [
      'Premium white leather upper',
      'Pink accent details',
      'Cushioned sole for comfort',
      'Durable rubber outsole',
      'Great with any casual outfit'
    ]
  }
];

const reviews = [
  {
    id: 1,
    productId: 'p1',
    title: 'Lovely dress — great fit',
    product: 'Pink Dress',
    rating: 4,
    body: 'The fabric is soft and the color is perfect for winter events. True to size and comfortable all evening.',
    author: 'Sarah L.'
  },
  {
    id: 2,
    productId: 'p2',
    title: 'Cute handbag for daily use',
    product: 'Pink Handbag',
    rating: 4,
    body: 'Compact but roomy enough for essentials. Gold accents feel high quality for the price.',
    author: 'Nora K.'
  },
  {
    id: 3,
    productId: 'p3',
    title: 'Stylish and warm',
    product: 'Denim Jacket',
    rating: 5,
    body: 'The patches add a unique touch. Warm enough for cool nights and pairs well with dresses or jeans.',
    author: 'Lina M.'
  },
  {
    id: 4,
    productId: 'p4',
    title: 'Everyday classic',
    product: 'Gold Hoop Earrings',
    rating: 4,
    body: 'Lightweight and polished. They elevate simple outfits without being heavy on the ears.',
    author: 'Hala R.'
  }
];

let currentPage = 'home';
let currentSearchQuery = '';

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.floor(rating) ? '★ ' : '☆ ';
  }
  return stars.trim();
}

function createProductCard(product, includeDescription = false) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  card.style.cursor = 'pointer';

  let descriptionHtml = '';
  if (includeDescription) {
    descriptionHtml = `<p class="description">${product.description}</p>`;
  }

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" loading="lazy" />
    <h3>${product.name}</h3>
    ${descriptionHtml}
    <p class="price">${product.price}</p>
    <div class="rating" aria-label="Rating ${product.rating} out of 5">
      ${renderStars(product.rating)}
    </div>
    <button type="button" class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.name}', '${product.price}')">
      Add to Cart
    </button>
  `;

  card.onclick = () => showProductDetail(product.id);
  return card;
}

function createReviewCard(review) {
  const card = document.createElement('article');
  card.className = 'review-card';
  card.dataset.reviewFor = review.productId;

  card.innerHTML = `
    <h3>${review.title}</h3>
    <div class="review-meta">
      ${review.product} — <span>${renderStars(review.rating)}</span>
    </div>
    <p class="review-body">${review.body}</p>
    <div class="review-author">— ${review.author}</div>
  `;

  return card;
}

function renderHomePage() {
  const homeProducts = document.getElementById('home-products');
  const reviewsGrid = document.getElementById('reviews-grid');

  homeProducts.innerHTML = '';
  reviewsGrid.innerHTML = '';

  products.forEach(product => {
    homeProducts.appendChild(createProductCard(product, false));
  });

  reviews.forEach(review => {
    reviewsGrid.appendChild(createReviewCard(review));
  });
}

function renderSearchPage(query) {
  const filtered = products.filter(product => {
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.id.toLowerCase().includes(q)
    );
  });

  const searchProducts = document.getElementById('search-products');
  const noResults = document.getElementById('no-results');
  const searchTitle = document.getElementById('search-title');
  const searchCount = document.getElementById('search-count');

  searchTitle.textContent = `Search Results for "${query}"`;
  searchCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'} found`;

  searchProducts.innerHTML = '';

  if (filtered.length > 0) {
    noResults.style.display = 'none';
    filtered.forEach(product => {
      searchProducts.appendChild(createProductCard(product, true));
    });
  } else {
    noResults.style.display = 'block';
    searchProducts.innerHTML = '';
  }
}

function navigateTo(page) {
  currentPage = page;

  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.style.display = 'none');

  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  if (page === 'home') {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('home-btn').classList.add('active');
    renderHomePage();
  } else if (page === 'about') {
    document.getElementById('about-page').style.display = 'block';
    document.getElementById('about-btn').classList.add('active');
  } else if (page === 'search') {
    document.getElementById('search-page').style.display = 'block';
    renderSearchPage(currentSearchQuery);
  } else if (page === 'product-detail') {
    document.getElementById('product-detail-page').style.display = 'block';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSearch(event) {
  event.preventDefault();

  const query = document.getElementById('search-input').value.trim();

  if (query) {
    currentSearchQuery = query;
    navigateTo('search');
  }
}

function addToCart(productName, price) {
  const cartCount = document.getElementById('cart-count');
  let count = parseInt(cartCount.textContent) || 0;
  count++;
  cartCount.textContent = count;

  showNotification(`${productName} added to cart!`);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #ff6b9d 0%, #f67280 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
    animation: slideIn 0.3s ease;
    z-index: 1000;
  `;
  notification.textContent = message;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

let currentProductQuantity = 1;

function showProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentProductQuantity = 1;

  document.getElementById('detail-image').src = product.image;
  document.getElementById('detail-image').alt = product.name;
  document.getElementById('detail-name').textContent = product.name;
  document.getElementById('detail-description').textContent = product.fullDescription;
  document.getElementById('detail-price').textContent = product.price;
  document.getElementById('detail-rating').innerHTML = `${renderStars(product.rating)} <span style="color: #666; margin-left: 0.5rem;">(${product.rating}/5)</span>`;

  const featuresList = document.getElementById('detail-features-list');
  featuresList.innerHTML = '';
  product.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featuresList.appendChild(li);
  });

  document.getElementById('quantity-input').value = 1;

  const relatedGrid = document.getElementById('related-products-grid');
  relatedGrid.innerHTML = '';
  const related = products.filter(p => p.id !== productId).slice(0, 3);
  related.forEach(p => {
    relatedGrid.appendChild(createProductCard(p, false));
  });

  navigateTo('product-detail');
}

function increaseQuantity() {
  currentProductQuantity++;
  document.getElementById('quantity-input').value = currentProductQuantity;
}

function decreaseQuantity() {
  if (currentProductQuantity > 1) {
    currentProductQuantity--;
    document.getElementById('quantity-input').value = currentProductQuantity;
  }
}

function addProductToCart() {
  const nameEl = document.getElementById('detail-name');
  const productName = nameEl.textContent;
  for (let i = 0; i < currentProductQuantity; i++) {
    addToCart(productName, '');
  }
  showNotification(`${currentProductQuantity}x ${productName} added to cart!`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHomePage();

  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.classList.add('active');
  }
});
