import State from "../js/state.js";
import { bindCardEvents } from "../js/ui.js";
import {renderMenuCard} from '../components/menuCrad.js';

// ── Inline SVG icon helpers ──────────────────────────────────────────────────
const icons = {
  pulse: `<svg xmlns="http://www.w3.org/2000/svg" class="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path stroke-linecap="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  utensils: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path stroke-linecap="round" d="M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  trophy: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path stroke-linecap="round" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path stroke-linecap="round" d="M4 22h16M8 22V11.5M16 22V11.5"/><path stroke-linecap="round" d="M6 4h12v9a6 6 0 0 1-12 0V4Z"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>`,
  flame: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>`,
  calendarQuick: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 6v6l4 2"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>`,
  smartphone: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path stroke-linecap="round" d="M12 18h.01"/></svg>`,
  chefsHat: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6v-7.13Z"/><path stroke-linecap="round" d="M6 17h12"/></svg>`,
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`,
  starFill: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
};

// ── Stat icon map ────────────────────────────────────────────────────────────
function statIcon(label = "") {
  const l = label.toLowerCase();
  if (l.includes("customer"))  return icons.users;
  if (l.includes("menu"))      return icons.utensils;
  if (l.includes("rating"))    return `<span class="text-amber-400">${icons.star}</span>`;
  if (l.includes("year"))      return icons.trophy;
  return icons.star;
}

export  function buildHomePage() {
  const state = State.get();
  
  const featured = state.menuItems.filter((i) => i.featured).slice(0, 4);
  const bestsellers = [...state.menuItems]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  const homeReviews = (state.reviews || []).slice(0, 6);

  const defaultStats = [
    { label: "Happy Customers", value: "1,000+", icon: null },
    { label: "Menu Items",      value: `${state.menuItems.length}+`, icon: null },
    { label: "Avg Rating",      value: "4.8 ★",  icon: null },
    { label: "Years of Taste",  value: "12+",    icon: null },
  ];

  const stats = state.site?.stats || defaultStats;

  return `
  <div class="space-y-10">

    <!-- HERO -->
    <div class="relative overflow-hidden rounded-3xl min-h-[340px] flex items-center"
      style="background:linear-gradient(135deg,#1a0a00 0%,#3d1400 50%,#1a0a00 100%)">
      <div class="absolute inset-0 opacity-20"
        style="background-image:radial-gradient(circle at 20% 50%,#f97316 0%,transparent 50%),radial-gradient(circle at 80% 20%,#ef4444 0%,transparent 50%)"></div>
      <div class="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80"
          class="w-full h-full object-cover opacity-60" alt="Food spread">
        <div class="absolute inset-0" style="background:linear-gradient(to right,#1a0a00,transparent)"></div>
      </div>
      <div class="relative z-10 p-8 md:p-12 max-w-lg">
        <div class="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span class="w-2 h-2 rounded-full bg-orange-400 animate-pulse block"></span>
          Now Accepting Orders
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
          Flavours That<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Tell Stories</span>
        </h1>
        <p class="text-gray-300 text-sm md:text-base mb-8">
          Experience authentic Indian cuisine crafted with passion. Every dish is a journey.
        </p>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.renderRoute('menu')"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm">
            Explore Menu ${icons.arrowRight}
          </button>
          <button onclick="window.renderRoute('booking')"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm">
            ${icons.calendar} Book Table
          </button>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${stats.map((s) => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
          <div class="flex justify-center mb-1 text-orange-500">${statIcon(s.label)}</div>
          <div class="text-xl font-black text-gray-900 dark:text-white">${s.value}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${s.label}</div>
        </div>`).join("")}
    </div>

    <!-- QUICK LINKS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      ${[
        { route: "menu",    icon: icons.menu,         label: "Full Menu",   color: "from-orange-400 to-rose-500" },
        { route: "offers",  icon: icons.flame,         label: "Offers",      color: "from-red-400 to-pink-500" },
        { route: "gallery", icon: icons.camera,        label: "Gallery",     color: "from-violet-400 to-purple-500" },
        { route: "booking", icon: icons.calendarQuick, label: "Book Table",  color: "from-emerald-400 to-teal-500" },
      ].map((q) => `
        <button onclick="window.renderRoute('${q.route}')"
          class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${q.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            ${q.icon}
          </div>
          <span class="text-sm font-bold text-gray-800 dark:text-gray-200">${q.label}</span>
        </button>`).join("")}
    </div>

    <!-- FEATURED -->
    ${featured.length ? `
    <section>
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-black text-gray-900 dark:text-white">Featured Dishes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Handpicked by our chefs</p>
        </div>
        <button onclick="window.renderRoute('menu')"
          class="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
          View All ${icons.arrowRight}
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="featured-grid">
        ${featured.map(renderMenuCard).join("")}
      </div>
    </section>` : ""}

    <!-- BESTSELLERS -->
    <section>
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span class="text-red-500">${icons.flame}</span> Best Sellers
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Most ordered this week</p>
        </div>
        <button onclick="window.renderRoute('menu')"
          class="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
          Full Menu ${icons.arrowRight}
        </button>
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
        <div class="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3">
          ${icons.clock} LIMITED TIME
        </div>
        <h3 class="text-2xl md:text-3xl font-black mb-2">20% OFF Family Feast</h3>
        <p class="text-white/80 text-sm mb-5">
          Use code <span class="font-bold bg-white/20 px-2 py-0.5 rounded-lg">FEAST20</span> on orders above ₹800
        </p>
        <button class="px-6 py-2.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
          View All Offers
        </button>
      </div>
    </div>

    <!-- HOW IT WORKS -->
    <section>
      <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6 text-center">How It Works</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${[
          { step: "01", title: "Browse Menu",    desc: "Explore our wide variety of dishes filtered by category, price, and rating.", icon: icons.search },
          { step: "02", title: "Order or Book",  desc: "Place your order via WhatsApp or book a table for dine-in experience.",      icon: icons.smartphone },
          { step: "03", title: "Enjoy & Relish", desc: "Fresh food prepared by our chefs, delivered to your table or doorstep.",     icon: icons.chefsHat },
        ].map((s) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div class="flex justify-center mb-3 text-orange-500 group-hover:scale-110 transition-transform">${s.icon}</div>
            <div class="text-xs font-black text-orange-500 mb-1">STEP ${s.step}</div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">${s.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">${s.desc}</p>
          </div>`).join("")}
      </div>
    </section>

    <!-- REVIEWS TEASER -->
    ${homeReviews.length ? `
    <section>
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span class="text-amber-400">${icons.star}</span> What Customers Say
        </h2>
        <button onclick="window.renderRoute('reviews')"
          class="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
          All Reviews ${icons.arrowRight}
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${homeReviews.map((r) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                ${r.avatar}
              </div>
              <div>
                <div class="font-semibold text-gray-900 dark:text-white text-sm">${r.name}</div>
                <div class="flex items-center gap-1 text-xs text-amber-500">
                  ${"★".repeat(r.rating)}
                  <span class="text-gray-400 ml-1">${r.date}</span>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 italic">"${r.text}"</p>
          </div>`).join("")}
      </div>
    </section>` : ""}

    <!-- FINAL CTA -->
    <div class="text-center py-10 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3">Ready to Order?</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Book a table or order via WhatsApp now</p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="https://wa.me/919999999999?text=Hi!+I'd+like+to+place+an+order" target="_blank"
          class="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all">
          ${icons.whatsapp} WhatsApp Order
        </a>
        <button onclick="window.renderRoute('booking')"
          class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg transition-all">
          ${icons.calendar} Book Table
        </button>
      </div>
    </div>

  </div>`;
}

export function bindHomeEvents() {
  bindCardEvents(document.getElementById("main-content"));
}