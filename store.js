import items from './items.json';
import formatCurrency from './util/formatCurrency';
import addGlobalEventListener from './util/addGlobalEventListener.js';
import { addToCart } from './shoppingCart.js';

const storeItemContainer = document.querySelector('[data-store-container]');
const storeItemTemplate = document.querySelector('#store-item-template');

function renderStoreItem(item) {
  const storeItem = storeItemTemplate.content.cloneNode(true);

  const container = storeItem.querySelector('[data-store-item]');
  container.dataset.itemId = item.id;

  const name = storeItem.querySelector('[data-name]');
  name.innerText = item.name;

  const category = storeItem.querySelector('[data-category]');
  category.innerText = item.category;

  const image = storeItem.querySelector('[data-image]');
  image.src = `https://dummyimage.com/210x130/${item.imageColor}/${item.imageColor}`;

  const price = storeItem.querySelector('[data-price]');

  price.innerText = formatCurrency(item.priceCents / 100);

  storeItemContainer.appendChild(storeItem);
}

// Note: confusing part
export function setupStore() {
  if (storeItemContainer == null) return;

  // Handle click event for adding
  addGlobalEventListener('click', '[data-add-to-cart-button]', (e) => {
    const id = e.target.closest('[data-store-item]').dataset.itemId;
    addToCart(parseInt(id));
  });

  items.forEach(renderStoreItem);
}
