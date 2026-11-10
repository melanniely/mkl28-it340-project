const root = document.documentElement;
const FADE_MS = 500;

// Fade the page in
function reveal() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.add("is-loaded"));
  });
}

// Fade to dark, then run the navigation
function leave(go) {
  root.classList.remove("is-loaded");
  setTimeout(go, FADE_MS);
}

// Internal link clicks
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (
    href &&
    !href.startsWith("http") &&
    !href.startsWith("#") &&
    !href.startsWith("mailto:") &&
    !link.hasAttribute("download") &&
    link.target !== "_blank"
  ) {
    e.preventDefault();
    leave(() => { window.location.href = href; });
  }
});

// Form submits (Sign In / Register buttons)
document.addEventListener("submit", (e) => {
  const form = e.target;
  e.preventDefault();
  leave(() => form.submit()); // form.submit() won't re-trigger this handler
});

// Initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", reveal);
} else {
  reveal();
}

// Back/forward button (page restored from cache)
window.addEventListener("pageshow", (e) => {
  if (e.persisted) reveal();
});