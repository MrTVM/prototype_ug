export function createModalSummary({
  item,
  complaintNo,
  received,
  applicantFio,
  applicantPhoneMasked,
  category,
  description,
  attachmentLabel,
  escapeText
}) {
  const summaryBlock = document.createElement("div");
  summaryBlock.className = "rounded-xl border border-slate-200/90 bg-white px-3 py-3 space-y-3";

  const headerGrid = document.createElement("div");
  headerGrid.className = "grid grid-cols-1 sm:grid-cols-3 gap-2";
  headerGrid.innerHTML = `
    <div>
      <div class="text-xs text-slate-500">СООБЩЕНИЕ</div>
      <div class="text-sm font-semibold text-slate-900 mt-1">№${escapeText(complaintNo)}</div>
    </div>
    <div>
      <div class="text-xs text-slate-500">Поступило</div>
      <div class="text-sm font-semibold text-slate-900 mt-1">${escapeText(received)}</div>
    </div>
    <div>
      <div class="text-xs text-slate-500">Плановая дата решения</div>
      <div class="text-sm font-semibold text-slate-900 mt-1">${escapeText(item.plannedCloseAt || "—")}</div>
    </div>
  `;

  const applicantInfo = document.createElement("div");
  applicantInfo.className = "pt-2 border-t border-slate-200/70";
  applicantInfo.innerHTML = `
    <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-700">
      <span>
        <span class="text-xs text-slate-500">Заявитель:</span>
        <span class="font-semibold text-slate-900">${escapeText(applicantFio)} (тел. ${escapeText(applicantPhoneMasked)})</span>
      </span>
      <span>
        <span class="text-xs text-slate-500">Категория:</span>
        <span class="font-semibold text-slate-900">${escapeText(category)}</span>
      </span>
    </div>
  `;

  const textInfo = document.createElement("div");
  textInfo.className = "pt-2 border-t border-slate-200/70 space-y-2";
  textInfo.innerHTML = `<div class="text-sm font-semibold text-slate-900">📝 ТЕКСТ СООБЩЕНИЯ</div>`;
  const quote = document.createElement("div");
  quote.className = "text-sm text-slate-900 whitespace-pre-line";
  quote.textContent = `«${description.trim()}»`;
  const attach = document.createElement("div");
  attach.className = "text-xs text-slate-500";
  attach.textContent = `📎 Вложения: ${attachmentLabel}`;
  textInfo.appendChild(quote);
  textInfo.appendChild(attach);

  summaryBlock.appendChild(headerGrid);
  summaryBlock.appendChild(applicantInfo);
  summaryBlock.appendChild(textInfo);

  return summaryBlock;
}
