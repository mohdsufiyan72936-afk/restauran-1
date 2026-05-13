// ============================================================
// pages/gallery.js — Gallery page with lightbox
// ============================================================

import State from "../js/state.js";

export  function buildGalleryPage() {
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


export function bindGalleryEvents() {
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
