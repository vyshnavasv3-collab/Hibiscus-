/* HIBISCUS COSMETICS — SHOPPING, SEARCH AND CHECKOUT */
let cart = [];
let currentCategory = "All";
let searchTerm = "";

const productGrid = document.getElementById("productGrid");
const noProducts = document.getElementById("noProducts");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const checkoutModal = document.getElementById("checkoutModal");

function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

function setActiveFilter(category) {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === category);
  });
}

function displayProducts() {
  const filteredProducts = products.filter(product => {
    const categoryMatch = currentCategory === "All" || product.category === currentCategory;
    const searchableText = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
    const searchMatch = searchableText.includes(searchTerm.toLowerCase().trim());
    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = "";
  noProducts.style.display = filteredProducts.length ? "none" : "block";

  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x700/f8eeee/7b4350?text=Hibiscus';">
        <span class="product-heart" aria-hidden="true">✿</span>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description || "An everyday Hibiscus favourite."}</p>
        <div class="product-bottom"><span class="product-price">${formatPrice(product.price)}</span><button class="add-btn" type="button" aria-label="Add ${product.name} to cart">Add to bag +</button></div>
      </div>`;
    card.querySelector(".add-btn").addEventListener("click", () => addToCart(product.id));
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  updateCart();
  openCart();
}

function updateCart() {
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart"><div class="empty-icon">♡</div><h3>Your bag is waiting</h3><p>Add a few favourites to get started.</p></div>`;
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/160x160/f8eeee/7b4350?text=Hibiscus';">
      <div class="cart-item-details"><h4>${item.name}</h4><div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="quantity"><button class="minus" type="button" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button class="plus" type="button" aria-label="Increase quantity">+</button></div>
        <button class="remove-item" type="button">Remove</button></div>`;
    row.querySelector(".minus").addEventListener("click", () => changeQuantity(item.id, -1));
    row.querySelector(".plus").addEventListener("click", () => changeQuantity(item.id, 1));
    row.querySelector(".remove-item").addEventListener("click", () => removeFromCart(item.id));
    cartItems.appendChild(row);
  });
  cartTotal.textContent = formatPrice(total);
}

function changeQuantity(productId, amount) {
  const item = cart.find(entry => entry.id === productId);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== productId);
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function openCart() {
  cartPanel.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("searchBtn").addEventListener("click", () => {
  searchBox.classList.toggle("active");
  if (searchBox.classList.contains("active")) searchInput.focus();
});
document.getElementById("closeSearch").addEventListener("click", () => {
  searchBox.classList.remove("active");
  searchInput.value = "";
  searchTerm = "";
  displayProducts();
});
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  displayProducts();
});

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.filter;
    setActiveFilter(currentCategory);
    displayProducts();
  });
});

document.querySelectorAll(".category-card").forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    setActiveFilter(currentCategory);
    displayProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("clearFilter").addEventListener("click", () => {
  currentCategory = "All";
  searchTerm = "";
  searchInput.value = "";
  setActiveFilter("All");
  displayProducts();
});

document.querySelectorAll(".offer-btn").forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.offerCategory;
    searchTerm = "";
    searchInput.value = "";
    setActiveFilter(currentCategory);
    displayProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your bag is empty. Add a product before checkout.");
    return;
  }
  closeCart();
  checkoutModal.classList.add("active");
});

document.getElementById("closeModal").addEventListener("click", () => checkoutModal.classList.remove("active"));
checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) checkoutModal.classList.remove("active");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    checkoutModal.classList.remove("active");
    searchBox.classList.remove("active");
  }
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) return;
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const lines = [
    "Hello Hibiscus! I'd like to place an order.",
    "",
    "*Customer details*",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    "",
    "*Order items*"
  ];
  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    lines.push(`${item.name} × ${item.quantity} = ${formatPrice(itemTotal)}`);
  });
  lines.push("", `*Subtotal: ${formatPrice(total)}*`, "Please confirm availability and delivery charges.");
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

document.getElementById("floatingWhatsApp").addEventListener("click", event => {
  event.preventDefault();
  const message = encodeURIComponent("Hello Hibiscus, I'd like to know more about your beauty and personal-care products.");
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
});

document.getElementById("year").textContent = new Date().getFullYear();
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("active");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});
mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
}));

displayProducts();
updateCart();
