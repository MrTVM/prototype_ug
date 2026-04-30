export function createViewSwitch({ onChange } = {}) {
  const buttons = Array.from(document.querySelectorAll("[data-view-btn]"));
  const views = {
    map: document.getElementById("view-map"),
    table: document.getElementById("view-table"),
    cards: document.getElementById("view-cards")
  };

  const ACTIVE_BUTTON_CLASSES = [
    "bg-slate-900",
    "text-white",
    "shadow-sm",
    "hover:bg-slate-800"
  ];
  const INACTIVE_BUTTON_CLASSES = ["bg-transparent", "text-slate-700"];

  const toggleButtonClasses = (btn, isActive) => {
    ACTIVE_BUTTON_CLASSES.forEach((className) => {
      btn.classList.toggle(className, isActive);
    });
    INACTIVE_BUTTON_CLASSES.forEach((className) => {
      btn.classList.toggle(className, !isActive);
    });
  };

  const setActive = (view) => {
    Object.entries(views).forEach(([key, node]) => {
      node?.classList.toggle("hidden", key !== view);
    });

    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-view-btn") === view;
      toggleButtonClasses(btn, isActive);
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

