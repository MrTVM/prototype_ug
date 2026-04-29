export function createViewSwitch({ onChange } = {}) {
  const buttons = Array.from(document.querySelectorAll("[data-view-btn]"));
  const views = {
    map: document.getElementById("view-map"),
    table: document.getElementById("view-table"),
    cards: document.getElementById("view-cards")
  };

  const setActive = (view) => {
    Object.entries(views).forEach(([key, node]) => {
      node?.classList.toggle("hidden", key !== view);
    });

    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-view-btn") === view;
      btn.classList.toggle("bg-slate-900", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("shadow-sm", isActive);
      btn.classList.toggle("hover:bg-slate-800", isActive);
      btn.classList.toggle("bg-transparent", !isActive);
      btn.classList.toggle("text-slate-700", !isActive);
    });
  };

  // Навешиваем обработчики 1 раз при создании.
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view-btn");
      setActive(view);
      onChange?.(view);
    });
  });

  return { setActive };
}

