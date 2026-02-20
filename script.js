(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth-scroll for in-page anchors
  document.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a[href^='#']") : null;
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Waitlist form progressive enhancement (AJAX submit + inline message)
  const form = document.getElementById("waitlist-form");
  const msg = document.getElementById("form-msg");

  if (form instanceof HTMLFormElement && msg) {
    form.addEventListener("submit", async (e) => {
      // Allow normal form submission if fetch is not available
      if (typeof fetch !== "function") return;
      e.preventDefault();

      msg.textContent = "Submitting…";

      const action = form.getAttribute("action") || "";
      if (action.includes("REPLACE_ME")) {
        msg.textContent =
          "Form endpoint not configured yet. Replace the Formspree URL in index.html.";
        return;
      }

      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          msg.textContent = "You’re on the list. Thanks — we’ll be in touch.";
        } else {
          msg.textContent = "Something went wrong. Please try again in a moment.";
        }
      } catch {
        msg.textContent = "Network error. Please try again.";
      }
    });
  }
})();
