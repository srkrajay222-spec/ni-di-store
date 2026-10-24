/*
  NI & DI STORE CONFIGURATION
  1) Replace whatsappNumber with your business WhatsApp number in international format:
     India example: 919876543210 (country code 91, no +, spaces, or dashes).
  2) Replace contactEmail with the email address where contact messages should go.
  3) Edit PRODUCTS below with your actual items and prices.
*/
const STORE_CONFIG = {
  whatsappNumber: "919XXXXXXXXX", // CHANGE THIS before publishing
  contactEmail: "your-email@example.com" // CHANGE THIS before publishing
};

const PRODUCTS = [
  { id: 1, name: "Everyday Essential", category: "Lifestyle", price: 499, description: "A thoughtful everyday favourite.", label: "N&D 01" },
  { id: 2, name: "The Classic Edit", category: "Accessories", price: 699, description: "A timeless addition to your collection.", label: "N&D 02" },
  { id: 3, name: "Little Luxury", category: "Lifestyle", price: 899, description: "A special find for yourself or someone else.", label: "N&D 03" },
  { id: 4, name: "Daily Favourite", category: "Accessories", price: 349, description: "Simple, useful, and easy to love.", label: "N&D 04" },
  { id: 5, name: "The Gift Edit", category: "Gifting", price: 599, description: "A lovely pick for a thoughtful gift.", label: "N&D 05" },
  { id: 6, name: "Signature Pick", category: "Lifestyle", price: 799, description: "One of our imagined signature picks.", label: "N&D 06" }
];

const cart = new Map();
let activeCategory = "All";
let searchTerm = "";
const money = amount => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const $ = selector => document.querySelector(selector);

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function renderCategories() {
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  $("#categories").innerHTML = categories.map(category =>
    `<button class="category-button ${category === activeCategory ? "active" : ""}" data-category="${safeText(category)}">${safeText(category)}</button>`
  ).join("");
}

function renderProducts() {
  const filtered = PRODUCTS.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(searchTerm)
  );
  $("#product-grid").innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-art">
        <div class="product-placeholder" aria-label="${safeText(p.name)} product image placeholder"><span>${safeText(p.label || "NI & DI")}</span></div>
      </div>
      <div class="product-info">
        <div><h3>${safeText(p.name)}</h3><p class="product-category">${safeText(p.category)}</p></div>
        <span class="product-price">${money(p.price)}</span>
      </div>
      <p class="product-category">${safeText(p.description)}</p>
      <div class="product-actions"><button class="add-button" data-add="${p.id}">Add to cart +</button></div>
    </article>`).join("");
  $("#empty-state").hidden = filtered.length !== 0;
}

function renderCart() {
  const lines = [...cart.entries()].map(([id, quantity]) => ({ product: PRODUCTS.find(p => p.id === id), quantity })).filter(x => x.product);
  $("#cart-count").textContent = lines.reduce((sum, line) => sum + line.quantity, 0);
  $("#cart-items").innerHTML = lines.length ? lines.map(({ product, quantity }) => `
    <div class="cart-line">
      <div><h3>${safeText(product.name)}</h3><p>${money(product.price)} each</p>
        <div class="quantity-controls">
          <button data-quantity="${product.id}" data-delta="-1" aria-label="Remove one ${safeText(product.name)}">−</button>
          <span>${quantity}</span>
          <button data-quantity="${product.id}" data-delta="1" aria-label="Add one ${safeText(product.name)}">+</button>
          <button data-remove="${product.id}" aria-label="Remove ${safeText(product.name)}" title="Remove item">×</button>
        </div>
      </div><span class="line-total">${money(product.price * quantity)}</span>
    </div>`).join("") : `<p class="cart-empty">Your cart is waiting for something lovely.</p>`;
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  $("#cart-subtotal").textContent = money(subtotal);
  $("#whatsapp-checkout").disabled = !lines.length;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}
function openCart() {
  $("#overlay").hidden = false;
  $("#cart-drawer").hidden = false;
  document.body.style.overflow = "hidden";
  $("#close-cart").focus();
}
function closeCart() {
  $("#overlay").hidden = true;
  $("#cart-drawer").hidden = true;
  document.body.style.overflow = "";
  $("#open-cart").focus();
}
function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast("Added to your cart");
}
function checkoutWhatsApp() {
  const number = STORE_CONFIG.whatsappNumber.replace(/\D/g, "");
  if (!number || number.includes("919XXXXXXXXX") || number.length < 10) {
    showToast("Store setup needed: add your WhatsApp number in script.js.");
    return;
  }
  const lines = [...cart.entries()].map(([id, quantity]) => ({ product: PRODUCTS.find(p => p.id === id), quantity })).filter(x => x.product);
  if (!lines.length) return;
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const message = [
    "Hello Ni & Di! I'd like to place an order:",
    "",
    ...lines.map(({ product, quantity }) => `• ${product.name} × ${quantity} — ${money(product.price * quantity)}`),
    "",
    `Subtotal: ${money(subtotal)}`,
    "Please confirm availability, delivery charges and payment instructions.",
    "",
    "My name:",
    "Delivery address:"
  ].join("\n");
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

$("#categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});
$("#search").addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});
$("#product-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
$("#cart-items").addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (qtyButton) {
    const id = Number(qtyButton.dataset.quantity);
    const next = (cart.get(id) || 0) + Number(qtyButton.dataset.delta);
    if (next <= 0) cart.delete(id); else cart.set(id, next);
    renderCart();
  }
  if (removeButton) {
    cart.delete(Number(removeButton.dataset.remove));
    renderCart();
  }
});
$("#open-cart").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
$("#continue-shopping").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("#cart-drawer").hidden) closeCart(); });
$("#whatsapp-checkout").addEventListener("click", checkoutWhatsApp);
$("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = STORE_CONFIG.contactEmail.trim();
  if (!email || email === "your-email@example.com" || !email.includes("@")) {
    $("#contact-note").textContent = "Store setup needed: add your email address in script.js.";
    return;
  }
  const subject = `Ni & Di website enquiry from ${form.get("name")}`;
  const body = `Name: ${form.get("name")}\nReply email: ${form.get("email")}\n\nMessage:\n${form.get("message")}`;
  $("#contact-note").textContent = "Your email app should open with the message ready to send.";
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
$("#year").textContent = new Date().getFullYear();
renderCategories();
renderProducts();
renderCart();
