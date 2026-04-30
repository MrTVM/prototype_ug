export function createModalContextTabs({ panels, tabs, initialTab }) {
  const wrap = document.createElement("div");
  wrap.className = "rounded-xl border border-slate-200 bg-white overflow-hidden";

  const tabsBar = document.createElement("div");
  tabsBar.className = "flex flex-wrap items-end gap-1 bg-slate-50 border-b border-slate-200 px-2 pt-2";

  const tabButtons = {};

  const activateTab = (key) => {
    Object.entries(panels).forEach(([panelKey, panel]) => {
      panel.classList.toggle("hidden", panelKey !== key);
    });
    Object.entries(tabButtons).forEach(([panelKey, btn]) => {
      const active = panelKey === key;
      btn.classList.toggle("bg-white", active);
      btn.classList.toggle("text-slate-900", active);
      btn.classList.toggle("border-slate-200", active);
      btn.classList.toggle("border-b-white", active);
      btn.classList.toggle("bg-transparent", !active);
      btn.classList.toggle("text-slate-600", !active);
      btn.classList.toggle("border-transparent", !active);
      btn.classList.toggle("hover:text-slate-900", !active);
    });
  };

  tabs.forEach(({ key, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rounded-t-lg px-3 py-1.5 text-xs font-medium transition border";
    btn.textContent = label;
    btn.addEventListener("click", () => activateTab(key));
    tabButtons[key] = btn;
    tabsBar.appendChild(btn);
  });

  wrap.appendChild(tabsBar);
  Object.values(panels).forEach((panel) => wrap.appendChild(panel));

  activateTab(initialTab);

  return { wrap, activateTab };
}
