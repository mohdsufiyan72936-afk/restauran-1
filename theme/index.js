import State from "../js/state.js";
export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
export function toggleTheme() {
  const theme = State.get().theme === "dark" ? "light" : "dark";
  State.set({ theme });
  localStorage.setItem("rb_theme", theme);
  applyTheme(theme);
}
