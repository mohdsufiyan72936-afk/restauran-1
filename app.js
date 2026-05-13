// ============================================================
// app.js — Main application controller (Static Edition)
// ============================================================

import State from "./js/state.js";
import {
  fetchMenu,
  fetchReviews,
  fetchHomeReviews,
  fetchOffers,
  fetchGallery,
  fetchSiteConfig,
  submitBooking,
  postData,
} from "./js/api.js";
import { showToast, closeItemModal } from "./js/ui.js";

import { toggleMobileSidebar } from "./js/utils.js";

// components
import { renderHeader, bindHeaderEvents } from "./components/header.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";

// routes
import { renderRoute } from "./routes/routes.js";

// theme
import { applyTheme } from "./theme/index.js";

// ─── INIT ────────────────────────────────────────────────
async function init() {
  applyTheme(State.get().theme);
  renderSidebar();
  renderHeader();
  bindHeaderEvents();
  renderFooter();
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

}

async function loadMenuData() {
  try {
    const items = await fetchMenu();
    State.set({ menuItems: items, filteredItems: items });
  } catch (e) {
    showToast("Failed to load menu. Please refresh.", "error");
  }
}

// ─── THEME ───────────────────────────────────────────────

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

// ─── EXPOSE & BOOT ───────────────────────────────────────
window.renderRoute = renderRoute;
document.addEventListener("DOMContentLoaded", init);
