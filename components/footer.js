// ============================================================
// footer.js — App Footer Component
// ============================================================

import { renderRoute } from "../routes/routes.js";

export function renderFooter() {
  const footer = document.getElementById("app-footer");
  if (!footer) return;

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <footer class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-10">

        <!-- Top grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          <!-- Brand -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2 mb-3 cursor-pointer" onclick="window.renderRoute('home')">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white text-lg font-black shadow">R</div>
              <span class="font-black text-xl tracking-tight text-gray-900 dark:text-white">Ruban<span class="text-orange-500">Core</span></span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Authentic Indian cuisine crafted with passion. Every dish tells a story — come taste yours.
            </p>
            <!-- Social links -->
            <div class="flex items-center gap-3">
              <a href="#" aria-label="Instagram" class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-900/20 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-900/20 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://wa.me/919999999999" aria-label="WhatsApp" target="_blank" class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-green-50 hover:text-green-500 dark:hover:bg-green-900/20 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul class="space-y-2.5">
              ${[
                { label: "Home", route: "home" },
                { label: "Menu", route: "menu" },
                { label: "Offers & Deals", route: "offers" },
                { label: "Gallery", route: "gallery" },
                { label: "Book a Table", route: "booking" },
              ]
                .map(
                  (l) => `
                <li>
                  <button onclick="window.renderRoute('${l.route}')"
                    class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group">
                    <svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                    ${l.label}
                  </button>
                </li>`,
                )
                .join("")}
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">123 Foodie Lane, MG Road<br>Bengaluru, Karnataka 560001</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <a href="tel:+919999999999" class="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors">+91 99999 99999</a>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <a href="mailto:hello@rubancore.com" class="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors">hello@rubancore.com</a>
              </li>
            </ul>
          </div>

          <!-- Opening Hours -->
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-4 uppercase tracking-wider">Opening Hours</h4>
            <ul class="space-y-2">
              ${[
                { day: "Mon – Thu", time: "12:00 PM – 10:00 PM" },
                { day: "Fri – Sat", time: "12:00 PM – 11:00 PM" },
                { day: "Sunday", time: "11:00 AM – 10:00 PM" },
              ]
                .map(
                  (h) => `
                <li class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">${h.day}</span>
                  <span class="font-semibold text-gray-700 dark:text-gray-300 text-xs">${h.time}</span>
                </li>`,
                )
                .join("")}
            </ul>
            <div class="mt-4 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Open Now
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-400 dark:text-gray-500">
            &copy; ${year} RubanCore Restaurant. All rights reserved.
          </p>
          <div class="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <a href="#" class="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" class="hover:text-orange-500 transition-colors">Terms of Service</a>
            <span>·</span>
            <button onclick="window.renderRoute('contact')" class="hover:text-orange-500 transition-colors">Contact</button>
          </div>
        </div>

      </div>
    </footer>`;
}
