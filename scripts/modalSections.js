export function createModalSections({
  ui,
  item,
  ownerships,
  uniqueBalanceHolderNames,
  isBalanceHolderDefined,
  hasAuthorityWarning,
  authorityValue,
  contract,
  contractor,
  status,
  pointsById,
  statusToBadge,
  escapeText,
  onOpenRelatedPoint
}) {
  const jurisdictionBox = ui.createPaddedSection();
  const jurGrid = ui.createSectionContent();

  const authorityInfo = document.createElement("div");
  authorityInfo.className = "space-y-2";
  authorityInfo.innerHTML = `<div class="text-xs font-semibold ${
    hasAuthorityWarning ? "text-rose-800" : "text-emerald-800"
  }">${hasAuthorityWarning ? "⚠️" : "✅"} Полномочия: ${escapeText(authorityValue)}</div>`;
  const authorityItems = document.createElement("div");
  authorityItems.className = "ml-2";
  ui.createBulletList(authorityItems, [
    hasAuthorityWarning
      ? "Обнаружены неоднозначные формы собственности, требуется проверка"
      : "Класс полномочий определён автоматически"
  ]);
  authorityInfo.appendChild(authorityItems);

  const propOk = document.createElement("div");
  propOk.className = "space-y-2";
  propOk.innerHTML = `<div class="text-xs font-semibold text-emerald-800">✅ Собственность</div>`;
  const propItems = document.createElement("div");
  propItems.className = "ml-2";
  const ownershipLines =
    ownerships.length > 0
      ? ownerships.map((entry, index) => {
          const cadastralNumber = entry?.cadastralNumber || "—";
          const ownershipForm = entry?.ownershipForm || "—";
          const vri = entry?.vri || "—";
          return `${index + 1}) КН: ${cadastralNumber}; Форма: ${ownershipForm}; ВРИ: ${vri}`;
        })
      : ["Объекты собственности не найдены"];
  ui.createBulletList(propItems, ownershipLines);
  propOk.appendChild(propItems);

  const balanceInfo = document.createElement("div");
  balanceInfo.className = "space-y-2";
  balanceInfo.innerHTML = `<div class="text-xs font-semibold ${
    isBalanceHolderDefined ? "text-emerald-800" : "text-rose-800"
  }">${isBalanceHolderDefined ? "✅" : "⚠️"} Балансодержатели</div>`;
  const balanceItems = document.createElement("div");
  balanceItems.className = "ml-2";
  const balanceLines =
    uniqueBalanceHolderNames.length > 0
      ? uniqueBalanceHolderNames.map((name, index) => `${index + 1}) ${name}`)
      : ["Балансодержатели не найдены"];
  ui.createBulletList(balanceItems, balanceLines);
  balanceInfo.appendChild(balanceItems);

  jurGrid.appendChild(authorityInfo);
  jurGrid.appendChild(propOk);
  jurGrid.appendChild(balanceInfo);
  jurisdictionBox.appendChild(jurGrid);

  const contractBox = ui.createPaddedSection();
  const contractItems = ui.createSectionContent();
  const found = document.createElement("div");
  found.className = `text-xs font-semibold ${contract ? "text-emerald-900" : "text-rose-900"}`;
  found.textContent = contract
    ? "✅ Найдено совпадение в реестре контрактов [ЕИС 🔵 Тест]"
    : "⚠️ Информация по обязательствам не найдена";
  contractItems.appendChild(found);

  const contractDetails = document.createElement("div");
  contractDetails.className = "ml-1 space-y-1 text-xs text-slate-900";
  const contractNumber = contract?.number || "45/25";
  const contractDate = contract?.date || "12.03.2025";
  const contractSubject = contract?.subject || "Содержание дорог местного значения";
  const contractContractor = contract?.contractor || contractor;
  const contractContractorInn = contract?.contractorInn || "7701234567";
  const contractContact = contract?.contact || "petrov@asphalt.ru | +7 (495) 123-45-67";
  const contractAmount = contract?.amount || "12,5 млн руб.";
  const contractEndDate = contract?.endDate || "31.12.2026";
  const contractSla = contract?.sla || "5 дней с момента фиксации";
  const contractPenalty = contract?.penalty || "0.1% от цены этапа / день";
  if (contract) {
    contractDetails.innerHTML = `
      <div>📄 Договор № ${escapeText(contractNumber)} от ${escapeText(contractDate)}</div>
      <div class="text-slate-600 ml-4">• Предмет: ${escapeText(contractSubject)}</div>
      <div class="text-slate-600 ml-4">• Подрядчик: ${escapeText(contractContractor)} (ИНН ${escapeText(contractContractorInn)}) 🏢</div>
      <div class="text-slate-600 ml-4">• Контакт: ${escapeText(contractContact)}</div>
      <div class="text-slate-600 ml-4">• Сумма: ${escapeText(contractAmount)} | Окончание: ${escapeText(contractEndDate)}</div>
      <div class="mt-2 text-slate-700">⏱ SLA по договору: ${escapeText(contractSla)}</div>
      <div class="text-slate-700">💰 Штрафные санкции: ${escapeText(contractPenalty)}</div>
      <div class="mt-2 font-semibold text-slate-900">🟢 Статус: ${escapeText(status)}</div>
    `;
  } else {
    contractDetails.innerHTML = `
      <div class="text-slate-600">Для выбранного объекта данные по контрактным обязательствам отсутствуют.</div>
    `;
  }
  contractItems.appendChild(contractDetails);
  contractBox.appendChild(contractItems);

  const relatedBox = ui.createPaddedSection();
  const relatedWrap = ui.createSectionContent();
  const relatedTitle = document.createElement("div");
  relatedTitle.className = "text-xs font-semibold text-slate-900";
  relatedTitle.textContent = "Похожие сообщения";
  relatedWrap.appendChild(relatedTitle);

  const relatedIds = Array.isArray(item.relatedPoints) ? item.relatedPoints : [];
  const relatedPoints = relatedIds.map((id) => pointsById.get(id)).filter(Boolean);
  if (relatedPoints.length === 0) {
    const empty = document.createElement("div");
    empty.className = "text-xs text-slate-600";
    empty.textContent = "Связанные сообщения не найдены.";
    relatedWrap.appendChild(empty);
  } else {
    relatedPoints.forEach((relatedPoint) => {
      const badge = statusToBadge(relatedPoint.status);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-full text-left rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 transition";
      btn.innerHTML = `
        <div class="text-xs font-semibold text-slate-900">${escapeText(relatedPoint.theme || relatedPoint.id)}</div>
        <div class="mt-1 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${escapeText(
            `${badge.bg} ${badge.text} ${badge.border}`
          )}">
            ${escapeText(relatedPoint.status || "—")}
          </span>
          <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            ${escapeText(relatedPoint.source || "—")}
          </span>
        </div>
        <div class="text-xs text-slate-600 mt-0.5">${escapeText(relatedPoint.address || "—")}</div>
        <div class="text-[11px] text-slate-500 mt-1">ID: ${escapeText(relatedPoint.id)} · ${escapeText(
        relatedPoint.requestType || "—"
      )}</div>
      `;
      btn.addEventListener("click", () => onOpenRelatedPoint(relatedPoint));
      relatedWrap.appendChild(btn);
    });
  }
  relatedBox.appendChild(relatedWrap);

  return { jurisdictionBox, contractBox, relatedBox, relatedPoints };
}
