import { statusToBadge } from "./constants.js";
import { el, escapeHtml } from "./utils.js";

export function createTableView() {
  const render = (items, onRowClick) => {
    const body = el("table-body");
    const count = el("table-count");
    if (!body || !count) return;

    count.textContent = String(items.length);
    body.innerHTML = "";

    items.forEach((item) => {
      const b = statusToBadge(item.status);
      const tr = document.createElement("tr");
      tr.className = "cursor-pointer transition bg-white hover:bg-slate-50";

      tr.innerHTML = `
        <td class="py-4 px-5">
          <div class="font-semibold text-slate-900">${escapeHtml(item.theme)}</div>
        </td>
        <td class="py-4 px-5">
          <div class="text-sm text-slate-600">${escapeHtml(item.address)}</div>
        </td>
        <td class="py-4 px-5">
          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${b.bg} ${b.text} border ${b.border}">
            ${escapeHtml(item.status)}
          </span>
        </td>
      `;

      tr.addEventListener("click", () => onRowClick(item));
      body.appendChild(tr);
    });
  };

  return { render };
}

