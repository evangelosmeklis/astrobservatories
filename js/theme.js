/* Shared light/dark theme toggle, used by every page.
 * Emits a "themechange" event that page scripts (e.g. the map) can react to. */

let theme = localStorage.getItem("asteroskopeia-theme") || "light";
const themeBtn = document.getElementById("theme-btn");

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
  document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

themeBtn.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  localStorage.setItem("asteroskopeia-theme", theme);
  applyTheme();
});

applyTheme();
