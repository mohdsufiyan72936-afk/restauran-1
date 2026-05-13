import State from "../js/state.js";
import {toggleMobileSidebar} from '../js/utils.js';
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
    label: "Offers ",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>`,
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>`,
  },
  {
    id: "reviews",
    label: "Reviews ",
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

export async function renderSidebar() {
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

export function updateSidebarActive(route) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    const isActive = btn.dataset.route === route;
    btn.className = `nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`;
  });
}
