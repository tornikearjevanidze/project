// Get Cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Update Cart Count in the Cart Icon
function updateCartCount() {
  const cart = getCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").innerText = cartCount;
}

// Update Cart Panel with Items
function updateCartPanel() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cart-items");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span>${item.name} x ${item.quantity}</span>
        <span>${item.price}</span>
      </div>
    `).join('');
  }
}

// Add Product to Cart
function addToCart(productId) {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      const cart = getCart();
      const existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    })
    .catch(error => console.error("Error loading product data:", error));
}

// Open Cart Panel
document.getElementById("cart-icon").addEventListener("click", () => {
  document.body.classList.add("cart-open");
  updateCartPanel();
});

// Close Cart Panel
document.getElementById("close-cart-btn").addEventListener("click", () => {
  document.body.classList.remove("cart-open");
});

// Checkout Button Redirect
document.getElementById("checkout-btn")?.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

// Display Products in Grid
function displayProducts(products, elementId) {
  const container = document.getElementById(elementId);
  container.innerHTML = products.map(product => `
    <div class="product-item">
      <img src="images/${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <a href="product-detail.html?id=${product.id}">View Details</a>
    </div>
  `).join('');
}

// Load Products from JSON
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (productId) {
    // If we're on a product detail page, load the specific product
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        const product = products.find(p => p.id == productId);
        if (product) {
          document.getElementById('product-detail').innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>${product.price}</strong></p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
          `;
        }
      })
      .catch(error => console.error("Error loading product data:", error));
  } else {
    // Otherwise, show the product grid
    fetch("products.json")
      .then(response => response.json())
      .then(products => {
        displayProducts(products, "product-grid");
      })
      .catch(error => console.error("Error loading products:", error));
  }
});
