let cart = [];

// Helper: Find item index in cart by id
function findCartItemIndex(id) {
  return cart.findIndex(item => item.id === id);
}
let products = []; // Array to hold all products

// Function to render products to the page (handles OUT OF STOCK and no products found)
function renderProducts(productList) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';
  if (productList.length === 1 && productList[0].stock === 0) {
    productsContainer.innerHTML = '<div style="padding:32px;text-align:center;color:#d32f2f;font-size:18px;">THE PRODUCT IS OUT OF STOCK</div>';
    return;
  }
  if (productList.length === 0) {
    productsContainer.innerHTML = '<div style="padding:32px;text-align:center;color:#878787;font-size:18px;">No products found</div>';
    return;
  }
  productList.forEach(product => {
    const outOfStock = product.stock === 0;
    const productDiv = document.createElement('div');
    productDiv.className = 'product-card';
    productDiv.innerHTML = `
      <img src="${product.img}" alt="${product.name}" width="120" />
      <div class="product-name">${product.name}</div>
      <div class="product-price">₹${product.price}</div>
      ${outOfStock
        ? `<div style="color:#d32f2f;font-weight:600;margin:8px 0;">OUT OF STOCK</div>`
        : `<button class="add-to-cart" data-id="${product.id}">Add to Cart</button>`
      }
    `;
    productsContainer.appendChild(productDiv);
  });
}
// Sort and filter logic similar to Flipkart
function sortProducts(order) {
  let sorted = [...products];
  if (order === 'low-to-high') {
    sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (order === 'high-to-low') {
    sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }
  renderProducts(sorted);
}

function filterProducts(category) {
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

// Flipkart-style sort and filter logic

// Sort: Only one sort active at a time, visually highlight selected
const sortButtons = document.querySelectorAll('.sort-btn');
sortButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    // Remove active class from all
    sortButtons.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    this.classList.add('active');
    // Sort products
    const order = this.getAttribute('data-sort');
    sortProducts(order);
  });
});

// Filter: Only one filter active at a time, visually highlight selected
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    // Remove active class from all
    filterButtons.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    this.classList.add('active');
    // Filter products
    const category = this.getAttribute('data-filter');
    filterProducts(category);
  });
});

// Initial render
renderProducts(products);
// Function to update the cart count and total
function updateCartView() {
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const cartItemsList = document.getElementById('cart-items');

  let total = 0;
  let count = 0;
  cartItemsList.innerHTML = '';

  cart.forEach(item => {
    total += item.quantity * parseFloat(item.price);
    count += item.quantity;

    // Flipkart/Amazon style cart row
    const row = document.createElement('div');
    row.className = 'cart-row flipkart-cart-row';
    row.innerHTML = `
      <div class="cart-img">
      <img src="${item.img || 'https://rukminim2.flixcart.com/image/128/128/kqgyhe80/shoe/6/0/2/6-3809-3809-6-bruton-grey-original-imag4h2g9zqzqzqz.jpeg'}" alt="${item.name}" width="80" />
      </div>
      <div class="cart-details">
      <div class="cart-name" style="font-weight:600;font-size:16px;">${item.name}</div>
      <div class="cart-price" style="color:#388e3c;font-size:15px;">₹${item.price}</div>
      <div class="cart-qty" style="margin:8px 0;">
        <button class="qty-btn minus" data-id="${item.id}" style="border:1px solid #ccc;background:#f1f3f6;width:28px;height:28px;">-</button>
        <span class="qty" style="margin:0 10px;">${item.quantity}</span>
        <button class="qty-btn plus" data-id="${item.id}" style="border:1px solid #ccc;background:#f1f3f6;width:28px;height:28px;">+</button>
      </div>
      <div class="cart-subtotal" style="font-size:13px;color:#878787;">Subtotal: ₹${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove-item" data-id="${item.id}" style="background:none;border:none;color:#2874f0;cursor:pointer;margin-top:6px;">Remove</button>
      </div>
    `;
    cartItemsList.appendChild(row);
  });

  cartCount.textContent = count;
  cartTotal.textContent = `₹${total.toFixed(2)}`;
}
// --- All search and product logic moved outside updateCartView below ---

// Search suggestion popup logic

// Find product Flipkart style (handles OUT OF STOCK and no products found)
function findProductFlipkartStyle(query) {
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  const searchResultsScreen = document.getElementById('search-results-screen');
  if (filtered.length === 1 && filtered[0].stock === 0) {
    if (searchResultsScreen) {
      searchResultsScreen.innerHTML = '<div style="padding:32px;text-align:center;color:#d32f2f;font-size:18px;">THE PRODUCT IS OUT OF STOCK</div>';
      searchResultsScreen.style.display = 'block';
      document.getElementById('products').innerHTML = '';
    } else {
      renderProducts(filtered);
    }
    return;
  }
  if (filtered.length > 0) {
    if (searchResultsScreen) {
      searchResultsScreen.innerHTML = '';
      searchResultsScreen.style.display = 'block';
      filtered.forEach(product => {
        const outOfStock = product.stock === 0;
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
          <img src="${product.img}" alt="${product.name}" width="120" />
          <div class="product-name">${product.name}</div>
          <div class="product-price">₹${product.price}</div>
          ${outOfStock
            ? `<div style="color:#d32f2f;font-weight:600;margin:8px 0;">OUT OF STOCK</div>`
            : `<button class="add-to-cart" data-id="${product.id}">Add to Cart</button>`
          }
        `;
        searchResultsScreen.appendChild(productDiv);
      });
      document.getElementById('products').innerHTML = '';
    } else {
      renderProducts(filtered);
    }
  } else {
    if (searchResultsScreen) {
      searchResultsScreen.innerHTML = '<div style="padding:32px;text-align:center;color:#878787;font-size:18px;">No products found</div>';
      searchResultsScreen.style.display = 'block';
      document.getElementById('products').innerHTML = '';
    } else {
      renderProducts([]);
    }
  }
}
const searchInput = document.getElementById('search-input');
const searchPopup = document.getElementById('search-popup');
const searchResultsScreen = document.getElementById('search-results-screen'); // New: separate screen for results

searchInput.addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();
  if (query.length === 0) {
    searchPopup.style.display = 'none';
    searchPopup.innerHTML = '';
    if (searchResultsScreen) searchResultsScreen.style.display = 'none';
    return;
  }
  const matches = products.filter(p => p.name.toLowerCase().includes(query));
  if (matches.length === 0) {
    searchPopup.style.display = 'none';
    searchPopup.innerHTML = '';
    if (searchResultsScreen) searchResultsScreen.style.display = 'none';
    return;
  }
  searchPopup.innerHTML = matches.map(p => `
    <div class="search-suggestion" data-id="${p.id}" style="padding:8px;cursor:pointer;">
      <img src="${p.img}" alt="${p.name}" width="40" style="vertical-align:middle;margin-right:8px;" />
      <span>${p.name}</span>
    </div>
  `).join('');
  searchPopup.style.display = 'block';
});

// Click on suggestion
searchPopup.addEventListener('click', function (e) {
  const suggestion = e.target.closest('.search-suggestion');
  if (suggestion) {
    const id = suggestion.getAttribute('data-id');
    const product = products.find(p => p.id == id);
    if (product) {
      if (searchResultsScreen) {
        searchResultsScreen.innerHTML = '';
        searchResultsScreen.style.display = 'block';
        // Render product in the separate screen
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
          <img src="${product.img}" alt="${product.name}" width="120" />
          <div class="product-name">${product.name}</div>
          <div class="product-price">₹${product.price}</div>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        searchResultsScreen.appendChild(productDiv);
      } else {
        renderProducts([product]);
      }
      searchPopup.style.display = 'none';
      searchInput.value = product.name;
    }
  }
});

// Search button logic
document.getElementById('search-btn').addEventListener('click', function () {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  if (searchResultsScreen) {
    searchResultsScreen.innerHTML = '';
    searchResultsScreen.style.display = 'block';
    filtered.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product-card';
      productDiv.innerHTML = `
        <img src="${product.img}" alt="${product.name}" width="120" />
        <div class="product-name">${product.name}</div>
        <div class="product-price">₹${product.price}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      searchResultsScreen.appendChild(productDiv);
    });
  } else {
    renderProducts(filtered);
  }
  searchPopup.style.display = 'none';
});

// Hide popup when clicking outside
document.addEventListener('click', function (e) {
  if (!searchPopup.contains(e.target) && e.target !== searchInput) {
    searchPopup.style.display = 'none';
  }
});

// Show searched products on main screen (like Flipkart/Amazon)
document.getElementById('search-btn').addEventListener('click', function () {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  // Hide search popup and results screen if any
  searchPopup.style.display = 'none';
  if (searchResultsScreen) searchResultsScreen.style.display = 'none';
  // Render filtered products on main product grid
  renderProducts(filtered.length > 0 ? filtered : []);
});

// Also allow pressing Enter in search input to trigger search
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('search-btn').click();
  }
});

// Show product in main frame when clicking a suggestion
searchPopup.addEventListener('click', function (e) {
  const suggestion = e.target.closest('.search-suggestion');
  if (suggestion) {
    const id = suggestion.getAttribute('data-id');
    const product = products.find(p => p.id == id);
    if (product) {
      // (Removed duplicate findProductFlipkartStyle function.)
    }
  } else {
    // No products found
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '<div style="padding:32px;text-align:center;color:#878787;font-size:18px;">No products found</div>';
    const searchResultsScreen = document.getElementById('search-results-screen');
    if (searchResultsScreen) {
      searchResultsScreen.innerHTML = '<div style="padding:32px;text-align:center;color:#878787;font-size:18px;">No products found</div>';
      searchResultsScreen.style.display = 'block';
    }
  }
});

// Attach to search button and Enter key
document.getElementById('search-btn').addEventListener('click', function () {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  findProductFlipkartStyle(query);
  searchPopup.style.display = 'none';
});

searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('search-btn').click();
  }
});
// (Removed duplicate findProductFlipkartStyle function.)