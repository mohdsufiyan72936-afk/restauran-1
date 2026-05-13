import State from "../js/state.js";
import {toggleTheme } from '../theme/index.js';
import { debounce} from '../js/ui.js';
import {toggleMobileSidebar} from '../js/utils.js'

 export async function renderHeader() {
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

export async function bindHeaderEvents() {
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