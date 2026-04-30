import { STATUS_ORDER, statusToBadge } from "./constants.js";
import { el, escapeHtml, groupBy } from "./utils.js";

export function createCardsView() {
  const render = (items, onCardClick) => {
    const kanban = el("cards-kanban");
    const count = el("cards-count");
    if (!kanban || !count) return;

    count.textContent = String(items.length);
    kanban.innerHTML = "";

    const byStatus = groupBy(items, (item) => item.status);

    const createColumn = (status) => {
      const colItems = byStatus.get(status) || [];
      const colBadge = statusToBadge(status);

      const column = document.createElement("div");
      column.className =
        "flex-1 min-w-0 flex flex-col px-4 py-3";

      const header = document.createElement("div");
      header.className = "flex items-center justify-between gap-3 mb-3";
      header.innerHTML = `
        <div class="min-w-0">
          <div class="text-sm font-semibold text-slate-900 line-clamp-1">${escapeHtml(status)}</div>
          <div class="text-xs text-slate-500 mt-1">Элементов: <span class="font-semibold text-slate-700">${colItems.length}</span></div>
        </div>
        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${colBadge.bg} ${colBadge.text} border ${colBadge.border}">
          ${colItems.length}
        </span>
      `;

      const list = document.createElement("div");
      list.className =
        "flex-1 overflow-y-hidden hover:overflow-y-auto max-h-[calc(100vh-22rem)] space-y-3 min-h-[40px]";

      if (colItems.length === 0) {
        list.innerHTML = `
          <div class="text-sm text-slate-500 bg-white/60 border border-slate-200/70 rounded-xl px-4 py-6 text-center">
            Пока пусто
          </div>
        `;
      } else {
        for (const item of colItems) {
          const card = document.createElement("button");
          card.type = "button";
          card.className =
            "w-full text-left rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer flex flex-col gap-3 p-4";

          const badge = statusToBadge(item.status);
          const sourceLabel = item.source ? escapeHtml(String(item.source)) : "Не указан";
          card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-900 line-clamp-2">${escapeHtml(item.theme)}</div>
                <div class="text-xs text-slate-600 leading-relaxed line-clamp-3 mt-2">${escapeHtml(item.description)}</div>
              </div>
            </div>

            <div class="mt-auto flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 min-w-0">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} border ${badge.border}">
                  ${escapeHtml(item.status)}
                </span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 max-w-[180px] truncate">
                  ${sourceLabel}
                </span>
              </div>
            </div>
          `;

          card.addEventListener("click", () => onCardClick(item));
          list.appendChild(card);
        }
      }

      column.appendChild(header);
      column.appendChild(list);
      return column;
    };

    for (const status of STATUS_ORDER) {
      // Даже если конкретной колонки нет в данных — она будет отображаться (как “канбан”).
      kanban.appendChild(createColumn(status));
    }
  };

  return { render };
}

