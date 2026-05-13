import State from "../js/state.js";
import { submitBooking } from "../js/api.js";
import { showToast } from "../js/ui.js";

export function buildBookingPage() {
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

export function bindBookingEvents() {
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
        `Your table for ${selectedGuests} guest(s) has been requested for ${date} at ${time}. Our team will review and confirm your booking shortly. You may receive a call or WhatsApp message from the restaurant manager for confirmation.`,
        "success",
        5000,
      );
      renderRoute("home");
    });
}
