// ============================================================
// app.js — Main application controller (Static Edition)
// ============================================================

import State from "./state.js";
import {
  fetchMenu,
  fetchReviews,
  fetchHomeReviews,
  fetchOffers,
  fetchGallery,
  fetchSiteConfig,
  submitBooking,
  postData,
} from "./api.js";
import {
  showToast,
  renderMenuCard,
  renderEmptyState,
  openItemModal,
  closeItemModal,
  updateCartBadge,
  debounce,
} from "./ui.js";

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

// ─── INIT ────────────────────────────────────────────────
async function init() {
  applyTheme(State.get().theme);
  renderSidebar();
  renderHeader();
  bindGlobalEvents();

  // Load all static data in parallel
  const [menu, reviews, offers, gallery, site] = await Promise.all([
    fetchMenu(),
    fetchReviews(),
    fetchOffers(),
    fetchGallery(),
    fetchSiteConfig(),
  ]);

  State.set({
    menuItems: menu,
    filteredItems: menu,
    reviews,
    offers,
    gallery,
    site,
  });

  renderRoute("home");
  updateCartBadge();
}

async function loadMenuData() {
  try {
    const items = await fetchMenu();
    State.set({ menuItems: items, filteredItems: items });
  } catch (e) {
    showToast("Failed to load menu. Please refresh.", "error");
  }
}

// ─── ROUTER ──────────────────────────────────────────────
export function renderRoute(route) {
  State.set({ activeRoute: route });
  updateSidebarActive(route);
  const main = document.getElementById("main-content");
  if (!main) return;
  main.style.opacity = "0";
  main.style.transform = "translateY(8px)";
  setTimeout(async () => {
    switch (route) {
      case "home":
        main.innerHTML = await buildHomePage();
        bindHomeEvents();
        break;
      case "menu":
        main.innerHTML = buildMenuPage();
        bindMenuEvents();
        break;
      case "gallery":
        main.innerHTML = buildGalleryPage();
        bindGalleryEvents();
        break;
      case "reviews":
        main.innerHTML = buildReviewsPage();
        bindReviewEvents();
        break;
      case "offers":
        main.innerHTML = buildOffersPage();
        bindOfferEvents();
        break;
      case "booking":
        main.innerHTML = buildBookingPage();
        bindBookingEvents();
        break;
      case "contact":
        main.innerHTML = buildContactPage();
        bindContactEvents();
        break;
      case "about":
        main.innerHTML = buildAboutPage();
        break;
      default:
        main.innerHTML = await buildHomePage();
        bindHomeEvents();
    }
    updateCartBadge();
    main.style.opacity = "1";
    main.style.transform = "translateY(0)";
  }, 150);
}

// ─── HEADER ──────────────────────────────────────────────
function renderHeader() {
  const header = document.getElementById("app-header");
  if (!header) return;
  header.innerHTML = `
    <div class="flex items-center justify-between h-16 px-4 md:px-6">
      <div class="flex items-center gap-3">
        <button id="sidebar-toggle" class="md:hidden w-10 h-10 flex items-center justify-center rounded-xl
          text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.renderRoute('home')">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white text-lg font-black shadow-md">R</div>
          <span class="font-black text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">Ruban<span class="text-orange-500">Core</span></span>
        </div>
      </div>
      <div class="flex-1 max-w-md mx-4 hidden md:block">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input id="header-search" type="text" placeholder="Search dishes, categories..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
            text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all">
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-toggle" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
          <svg class="w-5 h-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <svg class="w-5 h-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>
        

      </div>
    </div>`;
  bindHeaderEvents();
}

function bindHeaderEvents() {
  document
    .getElementById("theme-toggle")
    ?.addEventListener("click", toggleTheme);
  document
    .getElementById("sidebar-toggle")
    ?.addEventListener("click", toggleMobileSidebar);
  const hs = document.getElementById("header-search");
  if (hs) {
    hs.addEventListener(
      "input",
      debounce((e) => {
        State.set({
          filters: { ...State.get().filters, search: e.target.value },
        });
        if (State.get().activeRoute !== "menu") renderRoute("menu");
        else applyFiltersAndRender();
      }, 300),
    );
  }
}

// ─── SIDEBAR ─────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`,
  },
  {
    id: "menu",
    label: "Menu",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>`,
  },
  {
    id: "offers",
    label: "Offers 🔥",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>`,
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>`,
  },
  {
    id: "reviews",
    label: "Reviews ⭐",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>`,
  },
  {
    id: "booking",
    label: "Book Table",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`,
  },
  {
    id: "about",
    label: "About Us",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  },
  {
    id: "contact",
    label: "Contact",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>`,
  },
];

function renderSidebar() {
  const sidebar = document.getElementById("app-sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = `
    <div class="flex flex-col h-full py-4">
      <nav class="flex-1 px-3 space-y-0.5 overflow-y-auto  h-full">
        ${NAV_ITEMS.map(
          (item) => `
          <button class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200 ${
              State.get().activeRoute === item.id
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }"
            data-route="${item.id}">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${item.icon}</svg>
            <span>${item.label}</span>
          </button>`,
        ).join("")}
      </nav>
     
    </div>`;
  sidebar.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.innerWidth < 768) toggleMobileSidebar(false);
      renderRoute(btn.dataset.route);
    });
  });
}

function updateSidebarActive(route) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    const isActive = btn.dataset.route === route;
    btn.className = `nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`;
  });
}

// ─── THEME ───────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
function toggleTheme() {
  const theme = State.get().theme === "dark" ? "light" : "dark";
  State.set({ theme });
  localStorage.setItem("rb_theme", theme);
  applyTheme(theme);
}
function toggleMobileSidebar(forceClose) {
  const sidebar = document.getElementById("app-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!sidebar) return;
  const isOpen = !sidebar.classList.contains("-translate-x-full");
  const shouldClose = forceClose === false || isOpen;
  sidebar.classList.toggle("-translate-x-full", shouldClose);
  overlay?.classList.toggle("hidden", shouldClose);
}

// ─── GLOBAL EVENTS ───────────────────────────────────────
function bindGlobalEvents() {
  document
    .getElementById("sidebar-overlay")
    ?.addEventListener("click", () => toggleMobileSidebar(false));
  document.getElementById("item-modal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("item-modal")) closeItemModal();
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("#modal-close")) closeItemModal();
    const mf = e.target.closest("#modal-fav-btn");
    if (mf) handleFavToggle(parseInt(mf.dataset.id));
    const mc = e.target.closest("#modal-cart-btn");
    if (mc) handleAddToCart(parseInt(mc.dataset.id));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeItemModal();
  });
}

// ═══════════════════════════════════════════════════════════
// ── HOME PAGE ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
async function buildHomePage() {
  const state = State.get();
  const featured = state.menuItems.filter((i) => i.featured).slice(0, 4);
  const bestsellers = [...state.menuItems]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  // Home screen shows max 6 reviews from static JSON
  const homeReviews = (state.reviews || []).slice(0, 6);

  return `
  <div class="space-y-10">
    <!-- HERO -->
    <div class="relative overflow-hidden rounded-3xl min-h-[340px] flex items-center"
      style="background:linear-gradient(135deg,#1a0a00 0%,#3d1400 50%,#1a0a00 100%)">
      <div class="absolute inset-0 opacity-20" style="background-image:radial-gradient(circle at 20% 50%,#f97316 0%,transparent 50%),radial-gradient(circle at 80% 20%,#ef4444 0%,transparent 50%)"></div>
      <div class="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80" class="w-full h-full object-cover opacity-60" alt="Food spread">
        <div class="absolute inset-0" style="background:linear-gradient(to right,#1a0a00,transparent)"></div>
      </div>
      <div class="relative z-10 p-8 md:p-12 max-w-lg">
        <div class="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>Now Accepting Orders
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
          Flavours That<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Tell Stories</span>
        </h1>
        <p class="text-gray-300 text-sm md:text-base mb-8">Experience authentic Indian cuisine crafted with passion. Every dish is a journey.</p>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.renderRoute('menu')" class="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm">Explore Menu →</button>
          <button onclick="window.renderRoute('booking')" class="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm">📅 Book Table</button>
        </div>
      </div>
    </div>

    <!-- STATS (from site.json) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${(
        state.site?.stats || [
          { label: "Happy Customers", value: "1,000+", icon: "😊" },
          {
            label: "Menu Items",
            value: `${state.menuItems.length}+`,
            icon: "🍽️",
          },
          { label: "Avg Rating", value: "4.8 ★", icon: "⭐" },
          { label: "Years of Taste", value: "12+", icon: "🏆" },
        ]
      )
        .map(
          (s) => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <div class="text-2xl mb-1">${s.icon}</div>
          <div class="text-xl font-black text-gray-900 dark:text-white">${s.value}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${s.label}</div>
        </div>`,
        )
        .join("")}
    </div>

    <!-- QUICK LINKS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      ${[
        {
          route: "menu",
          icon: "🍽️",
          label: "Full Menu",
          color: "from-orange-400 to-rose-500",
        },
        {
          route: "offers",
          icon: "🔥",
          label: "Offers",
          color: "from-red-400 to-pink-500",
        },
        {
          route: "gallery",
          icon: "📸",
          label: "Gallery",
          color: "from-violet-400 to-purple-500",
        },
        {
          route: "booking",
          icon: "📅",
          label: "Book Table",
          color: "from-emerald-400 to-teal-500",
        },
      ]
        .map(
          (q) => `
        <button onclick="window.renderRoute('${q.route}')"
          class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${q.color} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">${q.icon}</div>
          <span class="text-sm font-bold text-gray-800 dark:text-gray-200">${q.label}</span>
        </button>`,
        )
        .join("")}
    </div>

    <!-- FEATURED -->
    ${
      featured.length
        ? `
    <section>
      <div class="flex items-center justify-between mb-5">
        <div><h2 class="text-xl font-black text-gray-900 dark:text-white">Featured Dishes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Handpicked by our chefs</p></div>
        <button onclick="window.renderRoute('menu')" class="text-sm font-semibold text-orange-500 hover:text-orange-600">View All →</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="featured-grid">
        ${featured.map(renderMenuCard).join("")}
      </div>
    </section>`
        : ""
    }

    <!-- BESTSELLERS -->
    <section>
      <div class="flex items-center justify-between mb-5">
        <div><h2 class="text-xl font-black text-gray-900 dark:text-white">🔥 Best Sellers</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Most ordered this week</p></div>
        <button onclick="window.renderRoute('menu')" class="text-sm font-semibold text-orange-500 hover:text-orange-600">Full Menu →</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="bestsellers-grid">
        ${bestsellers.map(renderMenuCard).join("")}
      </div>
    </section>

    <!-- OFFER BANNER -->
    <div class="rounded-2xl p-6 md:p-8 text-white overflow-hidden relative cursor-pointer"
      style="background:linear-gradient(135deg,#7c3aed,#db2777)"
      onclick="window.renderRoute('offers')">
      <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10"></div>
      <div class="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
      <div class="relative z-10">
        <div class="text-xs font-bold bg-white/20 inline-flex px-3 py-1 rounded-full mb-3">⏰ LIMITED TIME</div>
        <h3 class="text-2xl md:text-3xl font-black mb-2">20% OFF Family Feast</h3>
        <p class="text-white/80 text-sm mb-5">Use code <span class="font-bold bg-white/20 px-2 py-0.5 rounded-lg">FEAST20</span> on orders above ₹800</p>
        <button class="px-6 py-2.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">View All Offers</button>
      </div>
    </div>

    <!-- HOW IT WORKS -->
    <section>
      <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6 text-center">How It Works</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${[
          {
            step: "01",
            title: "Browse Menu",
            desc: "Explore our wide variety of dishes filtered by category, price, and rating.",
            icon: "🔍",
          },
          {
            step: "02",
            title: "Order or Book",
            desc: "Place your order via WhatsApp or book a table for dine-in experience.",
            icon: "📱",
          },
          {
            step: "03",
            title: "Enjoy & Relish",
            desc: "Fresh food prepared by our chefs, delivered to your table or doorstep.",
            icon: "🍽️",
          },
        ]
          .map(
            (s) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div class="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">${s.icon}</div>
            <div class="text-xs font-black text-orange-500 mb-1">STEP ${s.step}</div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">${s.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">${s.desc}</p>
          </div>`,
          )
          .join("")}
      </div>
    </section>

    <!-- REVIEWS TEASER — max 6, from reviews.json -->
    ${
      homeReviews.length
        ? `
    <section>
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-black text-gray-900 dark:text-white">⭐ What Customers Say</h2>
        <button onclick="window.renderRoute('reviews')" class="text-sm font-semibold text-orange-500 hover:text-orange-600">All Reviews →</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${homeReviews
          .map(
            (r) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold">${r.avatar}</div>
              <div><div class="font-semibold text-gray-900 dark:text-white text-sm">${r.name}</div>
                <div class="text-amber-500 text-xs">${"★".repeat(r.rating)} <span class="text-gray-400">${r.date}</span></div></div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 italic">"${r.text}"</p>
          </div>`,
          )
          .join("")}
      </div>
    </section>`
        : ""
    }

    <!-- FINAL CTA -->
    <div class="text-center py-10 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3">Ready to Order?</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Book a table or order via WhatsApp now</p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="https://wa.me/919999999999?text=Hi!+I'd+like+to+place+an+order" target="_blank"
          class="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all">💬 WhatsApp Order</a>
        <button onclick="window.renderRoute('booking')"
          class="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg transition-all">📅 Book Table</button>
      </div>
    </div>
  </div>`;
}

function bindHomeEvents() {
  bindCardEvents(document.getElementById("main-content"));
}

// ═══════════════════════════════════════════════════════════
// ── MENU PAGE ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function buildMenuPage() {
  const state = State.get();
  return `
  <div class="flex gap-6">
    <aside id="filter-panel" class="w-64 flex-shrink-0 hidden md:block">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm sticky top-4">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-gray-900 dark:text-white">Filters</h3>
          <button id="clear-filters" class="text-xs text-orange-500 hover:text-orange-600 font-semibold">Clear All</button>
        </div>
        <div class="mb-5">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Category</h4>
          <div class="space-y-1.5">
            ${CATEGORIES.map(
              (cat) => `
              <label class="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" name="category" value="${cat}" ${state.filters.category === cat ? "checked" : ""} class="text-orange-500 focus:ring-orange-400">
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors">${cat}</span>
              </label>`,
            ).join("")}
          </div>
        </div>
        <div class="mb-5">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Price Range <span class="text-orange-500 ml-1 normal-case font-semibold" id="price-label">₹0 – ₹${state.filters.priceMax}</span>
          </h4>
          <input type="range" id="price-range" min="0" max="2000" step="50" value="${state.filters.priceMax}" class="w-full accent-orange-500">
        </div>
        <div class="mb-5">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Min Rating</h4>
          <div class="flex gap-2 flex-wrap">
            ${[0, 4, 4.5, 4.8]
              .map(
                (r) => `
              <button class="rating-filter px-3 py-1 rounded-lg text-xs font-semibold border transition-all
                ${state.filters.rating === r ? "bg-orange-500 border-orange-500 text-white" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-400"}"
                data-rating="${r}">${r === 0 ? "All" : `★ ${r}+`}</button>`,
              )
              .join("")}
          </div>
        </div>
        <div>
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Sort By</h4>
          <select id="sort-select" class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent
            text-sm text-gray-700 dark:text-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="popularity" ${state.sort === "popularity" ? "selected" : ""}>Most Popular</option>
            <option value="price-asc"  ${state.sort === "price-asc" ? "selected" : ""}>Price: Low to High</option>
            <option value="price-desc" ${state.sort === "price-desc" ? "selected" : ""}>Price: High to Low</option>
            <option value="rating"     ${state.sort === "rating" ? "selected" : ""}>Highest Rated</option>
          </select>
        </div>
      </div>
    </aside>
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap items-center gap-3 mb-5">
        <div class="relative flex-1 min-w-48">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input id="menu-search" type="text" value="${state.filters.search}" placeholder="Search dishes..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800
            text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400">
        </div>
        <button id="mobile-filter-btn" class="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
          bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">⚙ Filters</button>
      </div>
      <div class="flex gap-2 flex-wrap mb-5">
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
      <div id="results-count" class="text-sm text-gray-500 dark:text-gray-400 mb-4"></div>
      <div id="menu-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
  </div>`;
}

function bindMenuEvents() {
  document.getElementById("menu-search")?.addEventListener(
    "input",
    debounce((e) => {
      State.set({
        filters: { ...State.get().filters, search: e.target.value },
      });
      applyFiltersAndRender();
    }, 300),
  );
  document.querySelectorAll(".cat-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      State.set({
        filters: { ...State.get().filters, category: btn.dataset.cat },
      });
      document.querySelectorAll(".cat-pill").forEach((b) => {
        b.className = `cat-pill px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          b.dataset.cat === btn.dataset.cat
            ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-orange-400"
        }`;
      });
      applyFiltersAndRender();
    });
  });
  document.querySelectorAll('input[name="category"]').forEach((input) => {
    input.addEventListener("change", () => {
      State.set({ filters: { ...State.get().filters, category: input.value } });
      applyFiltersAndRender();
    });
  });
  document.getElementById("price-range")?.addEventListener(
    "input",
    debounce((e) => {
      const val = parseInt(e.target.value);
      document.getElementById("price-label").textContent = `₹0 – ₹${val}`;
      State.set({ filters: { ...State.get().filters, priceMax: val } });
      applyFiltersAndRender();
    }, 200),
  );
  document.querySelectorAll(".rating-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = parseFloat(btn.dataset.rating);
      State.set({ filters: { ...State.get().filters, rating: r } });
      document.querySelectorAll(".rating-filter").forEach((b) => {
        b.className = `rating-filter px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
          parseFloat(b.dataset.rating) === r
            ? "bg-orange-500 border-orange-500 text-white"
            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-400"
        }`;
      });
      applyFiltersAndRender();
    });
  });
  document.getElementById("sort-select")?.addEventListener("change", (e) => {
    State.set({ sort: e.target.value });
    applyFiltersAndRender();
  });
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
    renderRoute("menu");
  });
  document
    .getElementById("mobile-filter-btn")
    ?.addEventListener("click", () => {
      document.getElementById("filter-panel")?.classList.toggle("hidden");
    });
  applyFiltersAndRender();
}

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
}

// ═══════════════════════════════════════════════════════════
// ── GALLERY PAGE — data from state.gallery (gallery.json) ─
// ═══════════════════════════════════════════════════════════
function buildGalleryPage() {
  const images = State.get().gallery || [];
  return `
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">📸 Gallery</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">A visual feast — our food, spaces, and moments</p>
    </div>
    <div class="flex gap-2 flex-wrap mb-6">
      ${["All", "Food", "Drinks", "Desserts", "Ambience", "Events"]
        .map(
          (cat) => `
        <button class="gallery-tab px-4 py-1.5 rounded-full text-sm font-semibold transition-all
          ${cat === "All" ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-orange-400"}"
          data-cat="${cat}">${cat}</button>`,
        )
        .join("")}
    </div>
    <div id="gallery-grid" class="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
      ${images
        .map(
          (img, i) => `
        <div class="gallery-item break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-xl transition-all duration-300"
          data-cat="${img.cat}" data-index="${i}">
          <img src="${img.url}" alt="${img.title}" loading="lazy"
            class="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            style="aspect-ratio:${i % 3 === 0 ? "1/1.3" : "1/1"}">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div>
              <p class="text-white text-xs font-bold">${img.title}</p>
              <p class="text-white/70 text-xs">${img.cat}</p>
            </div>
          </div>
        </div>`,
        )
        .join("")}
    </div>
    <div id="lightbox" class="hidden fixed inset-0 z-50 bg-black/95 flex items-center justify-center" role="dialog">
      <button id="lb-close" class="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors z-10">✕</button>
      <button id="lb-prev" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors">‹</button>
      <button id="lb-next" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors">›</button>
      <div class="max-w-3xl max-h-screen p-4 text-center">
        <img id="lb-img" src="" alt="" class="max-h-[80vh] max-w-full rounded-2xl object-contain mx-auto">
        <p id="lb-title" class="text-white font-bold mt-3 text-lg"></p>
        <p id="lb-cat" class="text-white/60 text-sm mt-1"></p>
      </div>
    </div>
  </div>`;
}

function bindGalleryEvents() {
  const images = State.get().gallery || [];
  let currentIndex = 0;

  document.querySelectorAll(".gallery-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const cat = tab.dataset.cat;
      document.querySelectorAll(".gallery-tab").forEach((t) => {
        t.className = `gallery-tab px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          t.dataset.cat === cat
            ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-orange-400"
        }`;
      });
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.style.display =
          cat === "All" || item.dataset.cat === cat ? "" : "none";
      });
    });
  });

  const openLightbox = (idx) => {
    currentIndex = idx;
    const img = images[idx];
    document.getElementById("lb-img").src = img.url;
    document.getElementById("lb-title").textContent = img.title;
    document.getElementById("lb-cat").textContent = img.cat;
    document.getElementById("lightbox").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    document.getElementById("lightbox").classList.add("hidden");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () =>
      openLightbox(parseInt(item.dataset.index)),
    );
  });
  document.getElementById("lb-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("lightbox")) closeLightbox();
  });
  document
    .getElementById("lb-prev")
    ?.addEventListener("click", () =>
      openLightbox((currentIndex - 1 + images.length) % images.length),
    );
  document
    .getElementById("lb-next")
    ?.addEventListener("click", () =>
      openLightbox((currentIndex + 1) % images.length),
    );
  document.addEventListener("keydown", function lb(e) {
    if (document.getElementById("lightbox")?.classList.contains("hidden")) {
      document.removeEventListener("keydown", lb);
      return;
    }
    if (e.key === "ArrowLeft")
      openLightbox((currentIndex - 1 + images.length) % images.length);
    if (e.key === "ArrowRight")
      openLightbox((currentIndex + 1) % images.length);
    if (e.key === "Escape") closeLightbox();
  });
}

// ═══════════════════════════════════════════════════════════
// ── REVIEWS PAGE — all reviews from state.reviews ─────────
// ═══════════════════════════════════════════════════════════
function buildReviewsPage() {
  const allReviews = State.get().reviews || [];
  const site = State.get().site || {};
  const avgRating = allReviews.length
    ? (
        allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      ).toFixed(1)
    : "0.0";
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: allReviews.filter((r) => r.rating === s).length,
  }));
  const ratingBreakdown = site.ratingBreakdown || [];

  return `
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">⭐ Customer Reviews</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Real experiences from our valued guests</p>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="text-center flex-shrink-0">
          <div class="text-7xl font-black text-gray-900 dark:text-white">${avgRating}</div>
          <div class="text-amber-500 text-2xl my-1">${"★".repeat(5)}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">${allReviews.length} reviews</div>
        </div>
        <div class="flex-1 w-full space-y-2">
          ${starCounts
            .map(({ stars, count }) => {
              const pct = allReviews.length
                ? Math.round((count / allReviews.length) * 100)
                : 0;
              return `
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">${stars}</span>
              <span class="text-amber-500 text-sm">★</span>
              <div class="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style="width:${pct}%"></div>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">${count}</span>
            </div>`;
            })
            .join("")}
        </div>
        ${
          ratingBreakdown.length
            ? `
        <div class="flex-shrink-0 text-center">
          <div class="grid grid-cols-3 gap-3">
            ${ratingBreakdown
              .map(
                (m) => `
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-2 text-center">
                <div class="text-base font-black text-gray-900 dark:text-white">${m.val}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 leading-tight">${m.label}</div>
              </div>`,
              )
              .join("")}
          </div>
        </div>`
            : ""
        }
      </div>
    </div>
    <div class="flex flex-wrap gap-3 mb-6">
      <div class="flex gap-2">
        ${["All", "5 ★", "4 ★", "Verified"]
          .map(
            (f) => `
          <button class="review-filter px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
            ${f === "All" ? "bg-orange-500 border-orange-500 text-white" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400"}"
            data-filter="${f}">${f}</button>`,
          )
          .join("")}
      </div>
    </div>
    <div id="reviews-list" class="space-y-4 mb-8">
      ${allReviews.map((r) => renderReviewCard(r)).join("")}
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 class="font-black text-gray-900 dark:text-white text-lg mb-5">✍️ Write a Review</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Your Name *</label>
            <input id="rev-name" type="text" placeholder="e.g. Rahul M."
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Dish Ordered</label>
            <input id="rev-dish" type="text" placeholder="e.g. Butter Chicken"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Rating *</label>
          <div class="flex gap-2" id="star-rating">
            ${[1, 2, 3, 4, 5].map((s) => `<button class="star-btn text-3xl text-gray-300 hover:text-amber-400 transition-colors" data-star="${s}">★</button>`).join("")}
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Your Review *</label>
          <textarea id="rev-text" rows="4" placeholder="Share your dining experience..."
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
        </div>
        <button id="submit-review" class="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
          Submit Review
        </button>
      </div>
    </div>
  </div>`;
}

function renderReviewCard(r) {
  return `
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">${r.avatar}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center flex-wrap gap-2 mb-1">
          <span class="font-bold text-gray-900 dark:text-white text-sm">${r.name}</span>
          ${r.verified ? '<span class="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>' : ""}
          <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">${r.date}</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-amber-500">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
          ${r.dish ? `<span class="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">${r.dish}</span>` : ""}
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${r.text}</p>
      </div>
    </div>
  </div>`;
}

function bindReviewEvents() {
  let selectedRating = 0;
  document.querySelectorAll(".star-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const s = parseInt(btn.dataset.star);
      document.querySelectorAll(".star-btn").forEach((b, i) => {
        b.style.color = i < s ? "#f59e0b" : "";
      });
    });
    btn.addEventListener("mouseleave", () => {
      document.querySelectorAll(".star-btn").forEach((b, i) => {
        b.style.color = i < selectedRating ? "#f59e0b" : "";
      });
    });
    btn.addEventListener("click", () => {
      selectedRating = parseInt(btn.dataset.star);
      document.querySelectorAll(".star-btn").forEach((b, i) => {
        b.style.color = i < selectedRating ? "#f59e0b" : "";
      });
    });
  });
  document.querySelectorAll(".review-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".review-filter").forEach((b) => {
        b.className = `review-filter px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          b === btn
            ? "bg-orange-500 border-orange-500 text-white"
            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400"
        }`;
      });
    });
  });
  document.getElementById("submit-review")?.addEventListener("click", () => {
    const name = document.getElementById("rev-name")?.value.trim();
    const text = document.getElementById("rev-text")?.value.trim();
    if (!name || !text || !selectedRating) {
      showToast("Please fill in your name, rating, and review.", "warning");
      return;
    }
    showToast(
      "🎉 Thank you for your review! It will be visible after approval.",
      "success",
      4000,
    );
    document.getElementById("rev-name").value = "";
    document.getElementById("rev-text").value = "";
    document.getElementById("rev-dish").value = "";
    selectedRating = 0;
    document.querySelectorAll(".star-btn").forEach((b) => (b.style.color = ""));
  });
}

// ═══════════════════════════════════════════════════════════
// ── OFFERS PAGE — data from state.offers (offers.json) ────
// ═══════════════════════════════════════════════════════════
function buildOffersPage() {
  const offers = State.get().offers || [];
  const site = State.get().site || {};
  return `
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">🔥 Offers & Deals</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Exclusive deals to make every meal more rewarding</p>
    </div>
    <div class="relative overflow-hidden rounded-3xl p-6 md:p-10 text-white mb-8"
      style="background:linear-gradient(135deg,#f97316,#ef4444,#ec4899)">
      <div class="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10"></div>
      <div class="absolute right-10 -bottom-8 w-32 h-32 rounded-full bg-white/10"></div>
      <div class="relative z-10 max-w-md">
        <div class="text-xs font-black bg-white/20 inline-flex px-3 py-1 rounded-full mb-3 tracking-wider">🔥 THIS WEEK'S TOP DEAL</div>
        <h2 class="text-3xl md:text-4xl font-black mb-3">20% OFF<br>Family Feast</h2>
        <p class="text-white/80 mb-5">The most loved combo — now at an unbeatable price. Feeds 4 people with everything included.</p>
        <div class="flex flex-wrap items-center gap-4">
          <div class="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-5 py-2.5">
            <div class="text-xs text-white/70 mb-0.5">Use Code</div>
            <div class="font-black text-xl tracking-widest">FEAST20</div>
          </div>
          <button onclick="window.renderRoute('menu')" class="px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Order Now →</button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      ${offers
        .map(
          (offer) => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="h-2 bg-gradient-to-r ${offer.color}"></div>
          <div class="p-5">
            <div class="flex items-start justify-between gap-2 mb-3">
              <span class="text-xs font-bold bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">${offer.badge}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500">${offer.expiry}</span>
            </div>
            <h3 class="font-black text-gray-900 dark:text-white text-base mb-2">${offer.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">${offer.desc}</p>
            <div class="flex items-center gap-3 mb-4">
              <div class="flex-1 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-center">
                <div class="text-xs text-gray-400 mb-0.5">Coupon Code</div>
                <div class="font-black text-gray-900 dark:text-white tracking-widest text-sm">${offer.code}</div>
              </div>
              <button class="copy-code-btn w-10 h-10 flex-shrink-0 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl flex items-center justify-center hover:bg-orange-100 transition-colors"
                data-code="${offer.code}" title="Copy code">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
              <span>💰 Saving: <strong class="text-emerald-600 dark:text-emerald-400">${offer.saving}</strong></span>
              <span>Min: ${offer.minOrder}</span>
            </div>
          </div>
        </div>`,
        )
        .join("")}
    </div>
    <div class="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
      <h4 class="font-bold text-gray-700 dark:text-gray-300 text-sm mb-3">📋 Terms & Conditions</h4>
      <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1.5 list-disc list-inside">
        ${(site.termsAndConditions || []).map((t) => `<li>${t}</li>`).join("")}
      </ul>
    </div>
  </div>`;
}

function bindOfferEvents() {
  document.querySelectorAll(".copy-code-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(btn.dataset.code)
        .then(() =>
          showToast(
            `📋 Code "${btn.dataset.code}" copied to clipboard!`,
            "success",
          ),
        )
        .catch(() => showToast(`Code: ${btn.dataset.code}`, "info"));
    });
  });
}

// ═══════════════════════════════════════════════════════════
// ── BOOKING PAGE — submits to Google Sheets only ──────────
// ═══════════════════════════════════════════════════════════
function buildBookingPage() {
  const site = State.get().site || {};
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return `
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">📅 Book a Table</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Reserve your spot for a memorable dining experience</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 class="font-black text-gray-900 dark:text-white mb-5">Table Reservation</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Full Name *</label>
              <input id="bk-name" type="text" placeholder="Your name"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Phone Number *</label>
              <input id="bk-phone" type="tel" placeholder="+91 XXXXX XXXXX"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Email Address</label>
            <input id="bk-email" type="email" placeholder="your@email.com"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Date *</label>
              <input id="bk-date" type="date" min="${minDate}"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Time *</label>
              <select id="bk-time" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Select time</option>
                ${["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"].map((t) => `<option>${t}</option>`).join("")}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Number of Guests *</label>
            <div class="flex gap-2 flex-wrap">
              ${[1, 2, 3, 4, 5, 6, "7+", "10+"]
                .map(
                  (n) => `
                <button class="guest-btn px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                  border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-400"
                  data-guests="${n}">${n}</button>`,
                )
                .join("")}
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Occasion</label>
            <div class="flex gap-2 flex-wrap">
              ${[
                "Regular Dining",
                "Birthday",
                "Anniversary",
                "Business Dinner",
                "Family Gathering",
                "Date Night",
                "Other",
              ]
                .map(
                  (o) => `
                <button class="occasion-btn px-3 py-1.5 rounded-full border text-xs font-semibold transition-all
                  border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-400"
                  data-occasion="${o}">${o}</button>`,
                )
                .join("")}
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Special Requests</label>
            <textarea id="bk-notes" rows="3" placeholder="Dietary requirements, seating preference, special decorations..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
          </div>
          <button id="submit-booking" class="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg text-base">
            Confirm Reservation
          </button>
          <p class="text-xs text-gray-400 dark:text-gray-500 text-center">We'll confirm via WhatsApp / call within 30 minutes</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-violet-100 dark:border-violet-800">
          <h3 class="font-black text-gray-900 dark:text-white mb-2">🎉 Event Booking</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Planning a party, corporate dinner, or wedding reception? We have dedicated spaces for events up to 150 guests.</p>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            ${(site.eventSpaces || []).map((f) => `<li class="flex items-center gap-2"><span class="text-violet-500">✓</span>${f}</li>`).join("")}
          </ul>
          <a href="tel:+919999999999" class="flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors text-sm">
            📞 Call for Event Enquiry
          </a>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">🕐 Opening Hours</h3>
          <div class="space-y-2.5">
            ${(site.hours || [])
              .map(
                (h) => `
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-700 dark:text-gray-300">${h.day}</span>
                <span class="font-semibold text-gray-900 dark:text-white">${h.time}</span>
              </div>`,
              )
              .join("")}
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">❓ Booking FAQ</h3>
          <div class="space-y-3">
            ${(site.bookingFaq || [])
              .map(
                (faq) => `
              <div class="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">${faq.q}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">${faq.a}</p>
              </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function bindBookingEvents() {
  let selectedGuests = null,
    selectedOccasion = null;

  document.querySelectorAll(".guest-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedGuests = btn.dataset.guests;
      document.querySelectorAll(".guest-btn").forEach((b) => {
        b.className = `guest-btn px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
          b === btn
            ? "bg-orange-500 border-orange-500 text-white shadow-md"
            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-400"
        }`;
      });
    });
  });

  document.querySelectorAll(".occasion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedOccasion = btn.dataset.occasion;
      document.querySelectorAll(".occasion-btn").forEach((b) => {
        b.className = `occasion-btn px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
          b === btn
            ? "bg-orange-500 border-orange-500 text-white"
            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-400"
        }`;
      });
    });
  });

  document
    .getElementById("submit-booking")
    ?.addEventListener("click", async () => {
      const name = document.getElementById("bk-name")?.value.trim();
      const phone = document.getElementById("bk-phone")?.value.trim();
      const email = document.getElementById("bk-email")?.value.trim();
      const date = document.getElementById("bk-date")?.value;
      const time = document.getElementById("bk-time")?.value;
      const notes = document.getElementById("bk-notes")?.value.trim();

      if (!name || !phone || !date || !time || !selectedGuests) {
        showToast(
          "Please fill in all required fields and select guests & time.",
          "warning",
        );
        return;
      }

      const btn = document.getElementById("submit-booking");
      btn.textContent = "Confirming...";
      btn.disabled = true;

      // ← Only this call hits a remote server (Google Sheets)
      const result = await submitBooking({
        name,
        phone,
        email,
        date,
        time,
        guests: selectedGuests,
        occasion: selectedOccasion,
        notes,
      });

      if (result.offline) {
        // Sheets unreachable — still confirm to user, log locally
        console.warn("[Booking] Sheets offline, booking not persisted:", {
          name,
          phone,
          date,
          time,
          guests: selectedGuests,
        });
      }

      showToast(
        `🎉 Table booked for ${selectedGuests} guest(s) on ${date} at ${time}! We'll confirm shortly.`,
        "success",
        5000,
      );
      renderRoute("home");
    });
}

// ═══════════════════════════════════════════════════════════
// ── CONTACT PAGE ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function buildContactPage() {
  const site = State.get().site?.restaurant || {};
  return `
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">📞 Contact Us</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">We'd love to hear from you</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="space-y-4">
        ${[
          {
            icon: "📞",
            label: "Call Us",
            value: site.phone || "+91 99999 99999",
            sub: "Mon–Sun, 10 AM – 10 PM",
            href: `tel:${site.phone || "+919999999999"}`,
            btnText: "Call Now",
            btnClass: "bg-blue-500 hover:bg-blue-600",
          },
          {
            icon: "💬",
            label: "WhatsApp",
            value: site.phone || "+91 99999 99999",
            sub: "Instant response, quick orders",
            href: `https://wa.me/${site.whatsapp || "919999999999"}?text=Hi RubanCore!`,
            btnText: "Open WhatsApp",
            btnClass: "bg-green-500 hover:bg-green-600",
          },
          {
            icon: "📧",
            label: "Email",
            value: site.email || "hello@rubancore.com",
            sub: "We reply within 24 hours",
            href: `mailto:${site.email || "hello@rubancore.com"}`,
            btnText: "Send Email",
            btnClass: "bg-violet-500 hover:bg-violet-600",
          },
        ]
          .map(
            (c) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">${c.icon}</div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">${c.label}</div>
              <div class="font-bold text-gray-900 dark:text-white text-sm">${c.value}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">${c.sub}</div>
            </div>
            <a href="${c.href}" ${c.href.startsWith("https") ? 'target="_blank"' : ""} class="px-3 py-2 ${c.btnClass} text-white font-semibold rounded-xl text-xs transition-colors flex-shrink-0">${c.btnText}</a>
          </div>`,
          )
          .join("")}
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">📍</div>
            <div>
              <div class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">Address</div>
              <div class="font-bold text-gray-900 dark:text-white text-sm mb-1">${site.name || "RubanCore"} Restaurant</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">${site.address?.line1 || ""}<br>${site.address?.line2 || ""}<br>${site.address?.line3 || ""}</div>
              <a href="${site.mapsUrl || "https://maps.google.com"}" target="_blank" class="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-xs mt-2 transition-colors">Get Directions →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 class="font-bold text-gray-900 dark:text-white">📍 Find Us</h3>
        <a href="${site.mapsUrl || "https://maps.google.com"}" target="_blank" class="text-sm font-semibold text-orange-500 hover:text-orange-600">Open in Maps →</a>
      </div>
      <div class="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
        <div class="text-center">
          <div class="text-5xl mb-3">🗺️</div>
          <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">${site.address?.line1 || "123 Foodie Lane, MG Road"}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${site.address?.line2 || "Bengaluru, Karnataka 560001"}</p>
          <a href="${site.mapsUrl || "https://maps.google.com"}" target="_blank"
            class="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            📍 Get Directions
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

function bindContactEvents() {
  /* no form in contact page */
}

// ═══════════════════════════════════════════════════════════
// ── ABOUT PAGE — data from state.site (site.json) ─────────
// ═══════════════════════════════════════════════════════════
function buildAboutPage() {
  const site = State.get().site || {};
  const stats = site.stats || [];
  const team = site.team || [];
  const timeline = site.timeline || [];
  const awards = site.awards || [];

  return `
  <div>
    <div class="relative overflow-hidden rounded-3xl min-h-[260px] flex items-center mb-8"
      style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)">
      <div class="absolute inset-0 opacity-30" style="background-image:url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=60');background-size:cover;background-position:center"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
      <div class="relative z-10 p-8 md:p-12 max-w-xl">
        <div class="text-xs font-bold text-orange-400 mb-3 tracking-widest">EST. ${site.restaurant?.established || "2012"}</div>
        <h1 class="text-3xl md:text-5xl font-black text-white mb-4">Our Story</h1>
        <p class="text-gray-300">Born from a family kitchen in Bengaluru, RubanCore has been serving authentic Indian flavours for over 12 years — one plate at a time.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      ${[
        {
          icon: "🌿",
          title: "Our Mission",
          desc: "To bring the authentic taste of Indian home cooking to every table — with freshness, integrity, and love in every dish we serve.",
        },
        {
          icon: "👨‍🍳",
          title: "Our Vision",
          desc: "To be the most loved restaurant in the city, celebrated not just for our food, but for the memories we help create.",
        },
        {
          icon: "💛",
          title: "Our Values",
          desc: "Quality ingredients. No shortcuts. Genuine hospitality. Every guest leaves happier than they arrived — that's our promise.",
        },
      ]
        .map(
          (v) => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
          <div class="text-4xl mb-3">${v.icon}</div>
          <h3 class="font-black text-gray-900 dark:text-white mb-2">${v.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${v.desc}</p>
        </div>`,
        )
        .join("")}
    </div>

    <div class="bg-gradient-to-r from-orange-500 to-rose-600 rounded-3xl p-8 text-white mb-8">
      <h2 class="text-2xl font-black text-center mb-8">By the Numbers</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        ${stats
          .map(
            (s) => `
          <div>
            <div class="text-4xl font-black mb-1">${s.value}</div>
            <div class="text-white/80 text-sm">${s.label}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6 text-center">👨‍🍳 Meet the Team</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${team
          .map(
            (t) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">${t.emoji}</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">${t.name}</h3>
            <p class="text-orange-500 text-xs font-semibold mt-0.5">${t.role}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${t.specialty}</p>
            <p class="text-xs text-gray-400 mt-0.5">${t.exp}</p>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-8">
      <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6">Our Journey</h2>
      <div class="space-y-0">
        ${timeline
          .map(
            (ev, i) => `
          <div class="flex gap-5 ${i < timeline.length - 1 ? "pb-6" : ""}">
            <div class="flex flex-col items-center flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs font-black shadow-md">${ev.year.slice(2)}</div>
              ${i < timeline.length - 1 ? '<div class="w-0.5 flex-1 bg-gradient-to-b from-orange-400 to-gray-200 dark:to-gray-700 mt-1 min-h-8"></div>' : ""}
            </div>
            <div class="flex-1 pb-1">
              <div class="text-xs font-bold text-orange-500 mb-0.5">${ev.year}</div>
              <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-1">${ev.title}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${ev.desc}</p>
            </div>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 class="font-bold text-gray-900 dark:text-white mb-4">🏆 Awards & Certifications</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        ${awards
          .map(
            (a) => `
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <div class="text-2xl mb-2">${a.icon}</div>
            <div class="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">${a.title}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${a.body}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
// ── SHARED CARD EVENTS ───────────────────────────────────
// ═══════════════════════════════════════════════════════════
function bindCardEvents(container) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".fav-btn");
    if (favBtn) {
      e.stopPropagation();
      handleFavToggle(parseInt(favBtn.dataset.id));
      return;
    }
    const cartBtn = e.target.closest(".add-to-cart-btn");
    if (cartBtn) {
      e.stopPropagation();
      handleAddToCart(parseInt(cartBtn.dataset.id));
      return;
    }
    const card = e.target.closest(".menu-card");
    if (card) {
      const item = State.get().menuItems.find(
        (i) => i.id === parseInt(card.dataset.id),
      );
      if (item) openItemModal(item);
    }
  });
}

function handleAddToCart(id) {
  const item = State.get().menuItems.find((i) => i.id === id);
  if (!item) return;
  State.addToCart(item);
  showToast(`🛒 "${item.name}" added to cart`, "success");
  updateCartBadge();
}

function handleFavToggle(id) {
  // Optional: implement favourites via State
}

// ─── EXPOSE & BOOT ───────────────────────────────────────
window.renderRoute = renderRoute;
document.addEventListener("DOMContentLoaded", init);
