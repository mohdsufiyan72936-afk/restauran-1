import State from "../js/state.js";

export  function buildReviewsPage() {
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

export function bindReviewEvents() {
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
