// ============================================================
// ui.js — Reusable UI helpers: toasts, skeleton, modals
// ============================================================

import State from './state.js';

// ─── TOAST NOTIFICATIONS ─────────────────────────────────
export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
  };

  const toast = document.createElement('div');
  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium
    ${colors[type]} transform translate-x-full opacity-0 transition-all duration-300 max-w-xs`;
  toast.innerHTML = `<span class="text-base">${icons[type]}</span><span>${message}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    });
  });

  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

// ─── SKELETON CARDS ──────────────────────────────────────
export function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton-card rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <div class="skeleton h-48 w-full"></div>
      <div class="p-4 space-y-3">
        <div class="skeleton h-4 w-3/4 rounded-full"></div>
        <div class="skeleton h-3 w-full rounded-full"></div>
        <div class="skeleton h-3 w-1/2 rounded-full"></div>
        <div class="flex justify-between mt-4">
          <div class="skeleton h-6 w-16 rounded-full"></div>
          <div class="skeleton h-8 w-24 rounded-xl"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── MENU CARD ───────────────────────────────────────────
export function renderMenuCard(item) {
  const isFav = State.isFavorite(item.id);
  const tagColors = { veg: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30', 'non-veg': 'text-red-600 bg-red-50 dark:bg-red-900/30' };
  const vegTag = item.tags.includes('veg') ? 'veg' : 'non-veg';

  return `
    <div class="menu-card group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm
      hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      data-id="${item.id}" role="article" aria-label="${item.name}">

      ${item.badge ? `<div class="badge-pill absolute top-3 left-3 z-10 text-xs font-bold px-3 py-1 rounded-full
        bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">${item.badge}</div>` : ''}

      <button class="fav-btn absolute top-3 right-3 z-10 w-9 h-9 rounded-full
        bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm flex items-center justify-center
        shadow-md transition-all hover:scale-110 active:scale-95"
        data-id="${item.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
        <svg class="w-5 h-5 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      <div class="relative overflow-hidden h-48">
        <img src="${item.image}" alt="${item.name}" loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm leading-tight">${item.name}</h3>
          <span class="flex-shrink-0 flex items-center gap-1 text-xs font-medium ${tagColors[vegTag]} px-2 py-0.5 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full ${vegTag === 'veg' ? 'bg-emerald-500' : 'bg-red-500'} inline-block"></span>
            ${vegTag}
          </span>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">${item.description}</p>

        <div class="flex items-center gap-2 mb-3">
          <span class="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            ★ ${item.rating}
          </span>
          ${item.tags.slice(0, 2).map(t => `<span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">${t}</span>`).join('')}
        </div>

        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-gray-900 dark:text-white">₹${item.price}</span>
          <button class="add-to-cart-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md hover:shadow-lg
            hover:from-orange-600 hover:to-rose-600 transition-all active:scale-95"
            data-id="${item.id}">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

// ─── EMPTY STATE ─────────────────────────────────────────
export function renderEmptyState(message = 'No items found') {
  return `
    <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div class="text-6xl mb-4">🍽️</div>
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">${message}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-500">Try adjusting your filters or search terms</p>
    </div>
  `;
}

// ─── MODAL ───────────────────────────────────────────────
export function openItemModal(item) {
  const modal = document.getElementById('item-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const vegTag = item.tags.includes('veg') ? 'veg' : 'non-veg';
  const isFav = State.isFavorite(item.id);

  content.innerHTML = `
    <div class="relative">
      <img src="${item.image}" alt="${item.name}"
        class="w-full h-64 object-cover rounded-t-2xl"
        onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60'">
      <button id="modal-close" class="absolute top-3 right-3 w-10 h-10 rounded-full
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center
        shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 text-xl font-bold">✕</button>
      ${item.badge ? `<div class="absolute bottom-3 left-3 text-xs font-bold px-3 py-1 rounded-full
        bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">${item.badge}</div>` : ''}
    </div>
    <div class="p-6">
      <div class="flex items-start justify-between gap-4 mb-3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">${item.name}</h2>
        <span class="flex-shrink-0 flex items-center gap-1 text-xs font-medium
          ${vegTag === 'veg' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-red-600 bg-red-50 dark:bg-red-900/30'}
          px-3 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full ${vegTag === 'veg' ? 'bg-emerald-500' : 'bg-red-500'} inline-block"></span>
          ${vegTag}
        </span>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${item.description}</p>
      <div class="flex flex-wrap gap-2 mb-6">
        <span class="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
          ★ ${item.rating} rating
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          🔥 ${item.popularity}% popularity
        </span>
        ${item.tags.map(t => `<span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${t}</span>`).join('')}
      </div>
      <div class="flex items-center justify-between gap-4">
        <span class="text-2xl font-bold text-gray-900 dark:text-white">₹${item.price}</span>
        <div class="flex gap-3">
          <button id="modal-fav-btn" class="w-11 h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600
            flex items-center justify-center hover:border-red-400 transition-colors"
            data-id="${item.id}">
            <svg class="w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
          <button id="modal-cart-btn" class="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg
            hover:from-orange-600 hover:to-rose-600 transition-all active:scale-95" data-id="${item.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

export function closeItemModal() {
  const modal = document.getElementById('item-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// ─── UPDATE CART BADGE ───────────────────────────────────
export function updateCartBadge() {
  const count = State.cartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ─── DEBOUNCE ────────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
