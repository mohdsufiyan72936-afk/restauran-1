import State from "../js/state.js";
import { bindCardEvents } from "../js/ui.js";
import { renderMenuCard, renderEmptyState } from "../components/menuCrad.js";

const CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Rice & Biryani",
  "Breads",
  "Combos",
  "Drinks",
  "Desserts",
];

// ── SVG icons ────────────────────────────────────────────────────────────────
const icons = {
  search: `<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
  filter: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L13 13.414V19a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 7 21v-7.586L3.293 6.707A1 1 0 0 1 3 6V4z"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  sortAsc: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>`,
};

export function buildMenuPage() {
  const state = State.get();
  console.log(state);

  return `
  <div class="space-y-4">

    <!-- TOP BAR: Search + Filter Toggle -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-48">
        ${icons.search}
        <input id="menu-search" type="text" value="${state.filters.search}" placeholder="Search dishes..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800
          text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400">
      </div>

      <!-- Filter Toggle Button -->
      <button id="filter-toggle-btn"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
        bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300
        hover:border-orange-400 hover:text-orange-500 transition-all relative">
        ${icons.filter}
        Filters
        <span id="filter-badge" class="hidden absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
        <span id="filter-chevron">${icons.chevronDown}</span>
      </button>
    </div>

    <!-- FILTER DROPDOWN PANEL -->
    <div id="filter-panel"
      class="hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span class="font-bold text-gray-900 dark:text-white text-sm">Filter & Sort</span>
        <button id="clear-filters"
          class="text-xs text-orange-500 hover:text-orange-600 font-semibold px-3 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
          Clear All
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-700">

        <!-- Category -->
        <div class="p-4">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Category</h4>
          <div class="grid grid-cols-2 gap-1.5">
            ${CATEGORIES.map(
              (cat) => `
              <label class="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="category" value="${cat}"
                  ${state.filters.category === cat ? "checked" : ""}
                  class="accent-orange-500 w-3.5 h-3.5 flex-shrink-0">
                <span class="text-xs text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors truncate">${cat}</span>
              </label>`,
            ).join("")}
          </div>
        </div>

        <!-- Price Range -->
        <div class="p-4">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Price Range</h4>
          <p class="text-sm font-semibold text-orange-500 mb-3" id="price-label">₹0 – ₹${state.filters.priceMax}</p>
          <input type="range" id="price-range" min="0" max="2000" step="50"
            value="${state.filters.priceMax}"
            class="w-full accent-orange-500">
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹0</span><span>₹2000</span>
          </div>
        </div>

        <!-- Min Rating -->
        <div class="p-4">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Min Rating</h4>
          <div class="flex flex-col gap-2">
            ${[
              { val: 0, label: "All Ratings" },
              { val: 4, label: "4.0 & above" },
              { val: 4.5, label: "4.5 & above" },
              { val: 4.8, label: "4.8 & above" },
            ]
              .map(
                (r) => `
              <label class="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="rating-filter" value="${r.val}"
                  ${state.filters.rating === r.val ? "checked" : ""}
                  class="accent-orange-500 w-3.5 h-3.5 flex-shrink-0">
                <span class="text-xs text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors flex items-center gap-1">
                  ${r.val > 0 ? `<span class="text-amber-400">${icons.star}</span> ${r.label}` : r.label}
                </span>
              </label>`,
              )
              .join("")}
          </div>
        </div>

        <!-- Sort By -->
        <div class="p-4">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Sort By</h4>
          <div class="flex flex-col gap-2">
            ${[
              { val: "popularity", label: "Most Popular" },
              { val: "price-asc", label: "Price: Low to High" },
              { val: "price-desc", label: "Price: High to Low" },
              { val: "rating", label: "Highest Rated" },
            ]
              .map(
                (s) => `
              <label class="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="sort-filter" value="${s.val}"
                  ${state.sort === s.val ? "checked" : ""}
                  class="accent-orange-500 w-3.5 h-3.5 flex-shrink-0">
                <span class="text-xs text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors">${s.label}</span>
              </label>`,
              )
              .join("")}
          </div>
        </div>

      </div>

      <!-- Apply button (mobile UX) -->
      <div class="p-3 border-t border-gray-100 dark:border-gray-700 flex justify-end sm:hidden">
        <button id="apply-filters-btn"
          class="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-bold rounded-xl">
          Apply Filters
        </button>
      </div>
    </div>

    <!-- CATEGORY PILLS (quick access) -->
    <div class="flex gap-2 flex-wrap">
      ${CATEGORIES.map(
        (cat) => `
        <button class="cat-pill px-4 py-1.5 rounded-full text-sm font-semibold transition-all
          ${
            state.filters.category === cat
              ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-orange-400"
          }"
          data-cat="${cat}">${cat}</button>`,
      ).join("")}
    </div>

    <!-- RESULTS COUNT + ACTIVE FILTER CHIPS -->
    <div class="flex flex-wrap items-center gap-2 min-h-[28px]">
      <span id="results-count" class="text-sm text-gray-500 dark:text-gray-400"></span>
      <div id="active-chips" class="flex flex-wrap gap-2"></div>
    </div>

    <!-- MENU GRID -->
    <div id="menu-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
  </div>`;
}

// ── Active filter chips ───────────────────────────────────────────────────────
function renderActiveChips() {
  const { filters, sort } = State.get();
  const chips = [];

  if (filters.category !== "All")
    chips.push({ key: "category", label: filters.category });
  if (filters.priceMax < 2000)
    chips.push({ key: "priceMax", label: `Up to ₹${filters.priceMax}` });
  if (filters.rating > 0)
    chips.push({ key: "rating", label: `${filters.rating}+ ★` });
  if (sort !== "popularity")
    chips.push({
      key: "sort",
      label: {
        "price-asc": "Price ↑",
        "price-desc": "Price ↓",
        rating: "Top Rated",
      }[sort],
    });

  const container = document.getElementById("active-chips");
  const badge = document.getElementById("filter-badge");
  if (!container) return;

  container.innerHTML = chips
    .map(
      (c) => `
    <span class="active-chip inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30
      text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full" data-chip-key="${c.key}">
      ${c.label}
      <button class="remove-chip hover:text-orange-900 dark:hover:text-orange-100 transition-colors" data-key="${c.key}">
        ${icons.close}
      </button>
    </span>`,
    )
    .join("");

  // Badge count
  if (badge) {
    if (chips.length > 0) {
      badge.textContent = chips.length;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  // Chip remove handlers
  container.querySelectorAll(".remove-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const defaults = { category: "All", priceMax: 2000, rating: 0 };
      if (key === "sort") State.set({ sort: "popularity" });
      else
        State.set({
          filters: { ...State.get().filters, [key]: defaults[key] },
        });
      applyFiltersAndRender();
      syncPanelToState();
    });
  });
}

// ── Sync panel inputs to current state ───────────────────────────────────────
function syncPanelToState() {
  const { filters, sort } = State.get();

  const catRadio = document.querySelector(
    `input[name="category"][value="${filters.category}"]`,
  );
  if (catRadio) catRadio.checked = true;

  const priceRange = document.getElementById("price-range");
  const priceLabel = document.getElementById("price-label");
  if (priceRange) priceRange.value = filters.priceMax;
  if (priceLabel) priceLabel.textContent = `₹0 – ₹${filters.priceMax}`;

  const ratingRadio = document.querySelector(
    `input[name="rating-filter"][value="${filters.rating}"]`,
  );
  if (ratingRadio) ratingRadio.checked = true;

  const sortRadio = document.querySelector(
    `input[name="sort-filter"][value="${sort}"]`,
  );
  if (sortRadio) sortRadio.checked = true;

  // Category pills
  document.querySelectorAll(".cat-pill").forEach((b) => {
    b.className = `cat-pill px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
      b.dataset.cat === filters.category
        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-orange-400"
    }`;
  });
}

// ── Debounce ──────────────────────────────────────────────────────────────────
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ── Bind events ───────────────────────────────────────────────────────────────
export function bindMenuEvents() {
  // Filter panel toggle
  const toggleBtn = document.getElementById("filter-toggle-btn");
  const filterPanel = document.getElementById("filter-panel");
  const chevron = document.getElementById("filter-chevron");

  toggleBtn?.addEventListener("click", () => {
    filterPanel?.classList.toggle("hidden");
    chevron?.querySelector("svg")?.classList.toggle("rotate-180");
  });

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !filterPanel?.classList.contains("hidden") &&
      !filterPanel?.contains(e.target) &&
      !toggleBtn?.contains(e.target)
    ) {
      filterPanel?.classList.add("hidden");
      chevron?.querySelector("svg")?.classList.remove("rotate-180");
    }
  });

  // Mobile apply button
  document
    .getElementById("apply-filters-btn")
    ?.addEventListener("click", () => {
      filterPanel?.classList.add("hidden");
      chevron?.querySelector("svg")?.classList.remove("rotate-180");
    });

  // Search
  document.getElementById("menu-search")?.addEventListener(
    "input",
    debounce((e) => {
      State.set({
        filters: { ...State.get().filters, search: e.target.value },
      });
      applyFiltersAndRender();
    }, 300),
  );

  // Category pills
  document.querySelectorAll(".cat-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      State.set({
        filters: { ...State.get().filters, category: btn.dataset.cat },
      });
      syncPanelToState();
      applyFiltersAndRender();
    });
  });

  // Category radios (inside panel)
  document.querySelectorAll('input[name="category"]').forEach((input) => {
    input.addEventListener("change", () => {
      State.set({ filters: { ...State.get().filters, category: input.value } });
      syncPanelToState();
      applyFiltersAndRender();
    });
  });

  // Price range
  document.getElementById("price-range")?.addEventListener(
    "input",
    debounce((e) => {
      const val = parseInt(e.target.value);
      document.getElementById("price-label").textContent = `₹0 – ₹${val}`;
      State.set({ filters: { ...State.get().filters, priceMax: val } });
      applyFiltersAndRender();
    }, 200),
  );

  // Rating radios
  document.querySelectorAll('input[name="rating-filter"]').forEach((input) => {
    input.addEventListener("change", () => {
      State.set({
        filters: { ...State.get().filters, rating: parseFloat(input.value) },
      });
      applyFiltersAndRender();
    });
  });

  // Sort radios
  document.querySelectorAll('input[name="sort-filter"]').forEach((input) => {
    input.addEventListener("change", () => {
      State.set({ sort: input.value });
      applyFiltersAndRender();
    });
  });

  // Clear all
  document.getElementById("clear-filters")?.addEventListener("click", () => {
    State.set({
      filters: {
        search: "",
        category: "All",
        priceMin: 0,
        priceMax: 2000,
        rating: 0,
        tag: null,
      },
      sort: "popularity",
    });
    document.getElementById("menu-search").value = "";
    syncPanelToState();
    applyFiltersAndRender();
  });

  applyFiltersAndRender();
}

// ── Core filter + render ──────────────────────────────────────────────────────
function applyFiltersAndRender() {
  const { menuItems, filters, sort } = State.get();
  let items = [...menuItems];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.tags.some((t) => t.includes(q)) ||
        i.category.toLowerCase().includes(q),
    );
  }
  if (filters.category !== "All")
    items = items.filter((i) => i.category === filters.category);

  items = items.filter(
    (i) => i.price >= filters.priceMin && i.price <= filters.priceMax,
  );

  if (filters.rating > 0)
    items = items.filter((i) => i.rating >= filters.rating);

  switch (sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      items.sort((a, b) => b.popularity - a.popularity);
  }

  State.set({ filteredItems: items });

  const grid = document.getElementById("menu-grid");
  const count = document.getElementById("results-count");
  if (!grid) return;

  if (count)
    count.textContent = `${items.length} item${items.length !== 1 ? "s" : ""} found`;

  grid.innerHTML = items.length
    ? items.map(renderMenuCard).join("")
    : renderEmptyState();
  bindCardEvents(grid);
  renderActiveChips();
}
