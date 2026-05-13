// ============================================================
// pages/offers.js — Offers & deals page
// ============================================================

import State from "../js/state.js";
import { showToast } from "../js/ui.js";

export  function buildOffersPage() {
  const offers = State.get().offers || [];
  const site = State.get().site || {};

  return `
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">🔥 Offers & Deals</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Exclusive deals to make every meal more rewarding</p>
    </div>

    <!-- HERO BANNER -->
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

    <!-- OFFER CARDS -->
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

    <!-- T&C -->
    <div class="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
      <h4 class="font-bold text-gray-700 dark:text-gray-300 text-sm mb-3">📋 Terms & Conditions</h4>
      <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1.5 list-disc list-inside">
        ${(site.termsAndConditions || []).map((t) => `<li>${t}</li>`).join("")}
      </ul>
    </div>
  </div>`;
}

export function bindEvents() {
  document.querySelectorAll(".copy-code-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(btn.dataset.code)
        .then(() => showToast(`📋 Code "${btn.dataset.code}" copied to clipboard!`, "success"))
        .catch(() => showToast(`Code: ${btn.dataset.code}`, "info"));
    });
  });
}

export function bindOfferEvents(){
      // TODO: Implement function logic


}

