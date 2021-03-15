import items from './items.json';
import formatCurrency from './util/formatCurrency.js';
import addGlobalEventListener from './util/addGlobalEventListener.js';

// Selectors
const cartButton = document.querySelector('[data-cart-button]');
const cartItemsWrapper = document.querySelector('[data-cart-items-wrapper]');
const cartItemTemplate = document.querySelector('#cart-item-template');
const cartItemsContainer = document.querySelector('[data-cart-items-container]');
const cartQuantity = document.querySelector('[data-cart-quantity]');
const cartTotal = document.querySelector('[data-cart-total]');
const cart = document.querySelector('[data-cart]');
const SESSION_STORAGE_KEY = 'SHOPPING_CART-cart';
let shoppingCart = [];

export function setupShoppingCart() {
  addGlobalEventListener('click', '[data-remove-cart-button]', (e) => {
    const id = parseInt(e.target.closest('[data-item]').dataset.itemId);
    removeFromCart(id);
  });
  shoppingCart = loadCart();
  renderCart();

  cartButton.addEventListener('click', () => {
    cartItemsWrapper.classList.toggle('invisible');
  });
}

// Add items to cart
export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);

  // Handle multiple of the same item in the cart
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }
  renderCart();
  saveCart();
}

// Remove items from the cart
function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem == null) return;
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id);
  renderCart();
  saveCart();
}

// show/hide the cart when clicked
function showCart() {
  cart.classList.remove('invisible');
}

function hideCart() {
  cart.classList.add('invisible');
  cartItemsWrapper.classList.add('invisible');
}

// show/hide the cart button when it has no items or when it goes from 0 to 1 item
function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderCartItems();
  }
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  cartQuantity.innerText = shoppingCart.length;

  // calculate accurate total
  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((item) => entry.id === item.id);
    return sum + item.priceCents * entry.quantity;
  }, 0);

  cartTotal.innerText = formatCurrency(totalCents / 100);
  shoppingCart.forEach((entry) => {
    const item = items.find((item) => entry.id === item.id);
    const cartItem = cartItemTemplate.content.cloneNode(true);

    const container = cartItem.querySelector('[data-item]');
    container.dataset.itemId = item.id;

    const name = cartItem.querySelector('[data-name]');
    name.innerText = item.name;

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector('[data-quantity]');
      quantity.innerText = `x${entry.quantity}`;
    }

    const image = cartItem.querySelector('[data-image]');
    image.src = `https://dummyimage.com/210x130/${item.imageColor}/${item.imageColor}`;

    const price = cartItem.querySelector('[data-price]');
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100);

    cartItemsContainer.appendChild(cartItem);
  });
}

// saving cart items to session storage
function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}

// loading cart items from session storage
function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return JSON.parse(cart) || [];
}
