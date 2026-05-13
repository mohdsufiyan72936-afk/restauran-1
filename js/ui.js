// ============================================================
// ui.js — Reusable UI helpers: toasts, skeleton, modals
// ============================================================

import State from "./state.js";

// ─── TOAST NOTIFICATIONS ─────────────────────────────────
export function showToast(message, type = "success", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const colors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
  };

  const toast = document.createElement("div");
  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium
    ${colors[type]} transform translate-x-full opacity-0 transition-all duration-300 max-w-xs`;
  toast.innerHTML = `<span class="text-base">${icons[type]}</span><span>${message}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove("translate-x-full", "opacity-0");
    });
  });

  setTimeout(() => {
    toast.classList.add("translate-x-full", "opacity-0");
    toast.addEventListener("transitionend", () => toast.remove());
  }, duration);
}

// ─── SKELETON CARDS ──────────────────────────────────────
export function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count)
    .fill(0)
    .map(
      () => `
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
  `,
    )
    .join("");
}

// ─── MODAL ───────────────────────────────────────────────
export function openItemModal(item) {
  const modal = document.getElementById("item-modal");
  const content = document.getElementById("modal-content");
  if (!modal || !content) return;

  const vegTag = item.tags.includes("veg") ? "veg" : "non-veg";

  content.innerHTML = `
    <div class="relative">
      <img src="${item.image}" alt="${item.name}"
        class="w-full h-64 object-cover rounded-t-2xl"
        onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60'">
      <button id="modal-close" class="absolute top-3 right-3 w-10 h-10 rounded-full
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center
        shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      ${
        item.badge
          ? `<div class="absolute bottom-3 left-3 text-xs font-bold px-3 py-1 rounded-full
        bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">${item.badge}</div>`
          : ""
      }
    </div>

    <div class="p-6">
      <!-- Name + veg indicator -->
      <div class="flex items-start justify-between gap-4 mb-3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">${item.name}</h2>
        <span class="flex-shrink-0 flex items-center gap-1 text-xs font-medium
          ${vegTag === "veg" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" : "text-red-600 bg-red-50 dark:bg-red-900/30"}
          px-3 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full ${vegTag === "veg" ? "bg-emerald-500" : "bg-red-500"} inline-block"></span>
          ${vegTag}
        </span>
      </div>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${item.description}</p>

      <!-- Tags / meta chips -->
      <div class="flex flex-wrap gap-2 mb-6">
        <span class="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          ${item.rating} rating
        </span>
        <span class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          ${item.popularity}% popularity
        </span>
        ${item.tags
          .map(
            (t) => `
          <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${t}</span>
        `,
          )
          .join("")}
      </div>

      <!-- Price only -->
      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold text-gray-900 dark:text-white">₹${item.price}</span>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

export function closeItemModal() {
  const modal = document.getElementById("item-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

// ─── DEBOUNCE ────────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function bindCardEvents(container) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".menu-card");
    if (card) {
      const item = State.get().menuItems.find(
        (i) => i.id === parseInt(card.dataset.id),
      );
      if (item) openItemModal(item);
    }
  });
}
