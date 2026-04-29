import { statusToBadge } from "./constants.js";
import { el, escapeHtml } from "./utils.js";

export function createCardsView() {
  const render = (items, onCardClick) => {
    const grid = el("cards-grid");
    const count = el("cards-count");
    if (!grid || !count) return;

    count.textContent = String(items.length);
    grid.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "text-left rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm px-4 py-4 cursor-pointer flex flex-col gap-3";

      const badge = statusToBadge(item.status);
      card.innerHTML = `
        <div class="rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 overflow-hidden h-44 flex items-center justify-center relative">
          <div class="absolute inset-0 opacity-60"
            style="background-image: radial-gradient(circle at 20% 20%, rgba(15,23,42,0.10), transparent 45%),
                                    radial-gradient(circle at 80% 40%, rgba(15,23,42,0.08), transparent 50%);">
          </div>
          <div class="relative z-10 text-sm font-semibold text-slate-700">Заглушка фото</div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <div class="text-sm font-semibold text-slate-900 line-clamp-1">${escapeHtml(item.theme)}</div>
        </div>

        <div class="text-sm text-slate-600 leading-relaxed line-clamp-3">${escapeHtml(item.description)}</div>

        <div class="mt-auto">
          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${badge.bg} ${badge.text} border ${badge.border}">
            ${escapeHtml(item.status)}
          </span>
        </div>
      `;

      card.addEventListener("click", () => onCardClick(item));
      grid.appendChild(card);
    });
  };

  return { render };
}

