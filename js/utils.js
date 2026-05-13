export function toggleMobileSidebar(forceClose) {
  const sidebar = document.getElementById("app-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!sidebar) return;
  const isOpen = !sidebar.classList.contains("-translate-x-full");
  const shouldClose = forceClose === false || isOpen;
  sidebar.classList.toggle("-translate-x-full", shouldClose);
  overlay?.classList.toggle("hidden", shouldClose);
}