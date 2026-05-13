// ============================================================
// menuCard.js — Menu Card Component (no cart / favourite buttons)
// ============================================================

/**
 * Renders a single menu item card.
 * Cards are click-to-open-modal only; add-to-cart and favourite
 * buttons have been intentionally removed per design spec.
 *
 * @param {Object} item  — menu item from state
 * @returns {string}     — HTML string
 */
export function renderMenuCard(item) {
  const isVeg = item.tags?.includes("veg");
  const isNew = item.tags?.includes("new");
  const isBestseller = item.tags?.includes("bestseller");

  return `
    <div class="menu-card group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm
      hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      data-id="${item.id}">

      <!-- Image -->
      <div class="relative overflow-hidden h-44">
        <img
          src="${item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=70"}"
          alt="${item.name}"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <!-- Veg / Non-veg indicator -->
        <div class="absolute top-3 left-3">
          <div class="w-5 h-5 rounded border-2 flex items-center justify-center ${isVeg ? "border-emerald-600 bg-white" : "border-rose-600 bg-white"}">
            <div class="w-2 h-2 rounded-full ${isVeg ? "bg-emerald-500" : "bg-rose-500"}"></div>
          </div>
        </div>

        <!-- Badges -->
        <div class="absolute top-3 right-3 flex flex-col gap-1.5">
          ${isNew ? `
            <span class="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full shadow">NEW</span>
          ` : ""}
          ${isBestseller ? `
            <span class="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full shadow">
              <span class="flex items-center gap-0.5">
                <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                BEST
              </span>
            </span>
          ` : ""}
          ${item.featured ? `
            <span class="text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full shadow">CHEF'S PICK</span>
          ` : ""}
        </div>
      </div>

      <!-- Body -->
      <div class="p-4">
        <!-- Name & Rating -->
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">${item.name}</h3>
          <div class="flex items-center gap-1 flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">${item.rating ?? "–"}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">${item.description || ""}</p>

        <!-- Price + Category -->
        <div class="flex items-center justify-between">
          <span class="font-black text-base text-gray-900 dark:text-white">₹${item.price}</span>
          <span class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">${item.category}</span>
        </div>

        <!-- View Details hint -->
        <div class="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          View Details
        </div>
      </div>
    </div>`;
}

/**
 * Empty state shown when no menu items match filters.
 */
export function renderEmptyState() {
  return `
    <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-1">No dishes found</h3>
      <p class="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters or search term</p>
    </div>`;
}