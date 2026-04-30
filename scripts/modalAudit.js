export function createModalAuditSection({
  ui,
  now,
  item,
  relatedPoints,
  ownerships,
  uniqueBalanceHolderNames,
  isBalanceHolderDefined,
  hasAuthorityWarning,
  escalationRule,
  garObjectType,
  parseCoords,
  extractDatePart,
  distanceMeters,
  resolveAuthorityLevel,
  escapeText,
  pad2,
  onGarVerified,
  onPhotoVerified,
  activateContextTab,
  getOnRecommendationReady
}) {
  const auditBox = ui.createPaddedSection();
  const auditProgress = document.createElement("div");
  auditProgress.className =
    "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700";

  const updateAuditProgressLabel = (shownCount, totalCount, done = false) => {
    const shown = Math.max(0, Math.min(shownCount, totalCount));
    auditProgress.textContent = done
      ? `Прогресс проверки: ${shown}/${totalCount} (завершено)`
      : `Прогресс проверки: ${shown}/${totalCount}`;
  };
  updateAuditProgressLabel(0, 0);

  const audit = document.createElement("div");
  audit.className = "mt-3 space-y-1";

  const base = new Date(now.getTime());
  const mkTime = (offsetSec) => {
    const t = new Date(base.getTime() + offsetSec * 1000);
    return `${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}`;
  };
  const mkDateTime = (offsetSec) => {
    const t = new Date(base.getTime() + offsetSec * 1000);
    return `${pad2(t.getDate())}.${pad2(t.getMonth() + 1)}.${t.getFullYear()} ${mkTime(offsetSec)}`;
  };

  const sourceLabel = item.source || "не указан";
  const pointCoords = parseCoords(item.coords);
  const pointDate = extractDatePart(item.createdAt);
  const photoMetaRows = (Array.isArray(item.photoGallery) ? item.photoGallery : [])
    .map((photo) => (typeof photo === "string" ? {} : photo?.meta || {}))
    .filter((meta) => Object.keys(meta).length > 0);
  const photoChecks = photoMetaRows.map((meta) => {
    const photoCoords = parseCoords(meta.coordinates || meta.geoCoordinates);
    const updatedDate = extractDatePart(meta.updatedAt || meta.updated_at);
    const geoOk = Boolean(pointCoords && photoCoords) && distanceMeters(pointCoords, photoCoords) <= 200;
    const dateOk = Boolean(pointDate) && pointDate === updatedDate;
    return { geoOk, dateOk, updatedDate: updatedDate || "—", coords: meta.coordinates || meta.geoCoordinates || "—" };
  });
  const verifiedPhotos = photoChecks.filter((check) => check.geoOk && check.dateOk).length;
  const photoStatus =
    photoChecks.length === 0 ? "Ожидание" : verifiedPhotos === photoChecks.length ? "Успешно" : "Ошибка";
  const photoText =
    photoChecks.length === 0
      ? "Сверка мета фото: метаданные отсутствуют"
      : `Сверка мета фото: ${verifiedPhotos}/${photoChecks.length} совпало по координатам и дате`;

  const relatedCount = relatedPoints.length;
  const relatedText =
    relatedCount > 0
      ? `Поиск похожих сообщений: найдено ${relatedCount}`
      : "Поиск похожих сообщений: совпадений не найдено";

  const cadastralNumbers = ownerships.map((entry) => entry?.cadastralNumber).filter(Boolean);
  const rosreestrRequestDone = cadastralNumbers.length > 0;
  const balanceText = uniqueBalanceHolderNames.length > 0 ? uniqueBalanceHolderNames.join("; ") : "не определены";

  const authorityRows = ownerships.map((entry) => {
    const kn = entry?.cadastralNumber || "—";
    const form = entry?.ownershipForm || "не указана";
    const level = resolveAuthorityLevel(form);
    const label =
      level === "municipal"
        ? "муниципальные"
        : level === "regional"
          ? "региональные"
          : level === "private"
            ? "частные"
            : "федеральные";
    return `${kn} → ${label}`;
  });

  const municipalRows = ownerships.filter(
    (entry) => resolveAuthorityLevel(entry?.ownershipForm || "") === "municipal"
  );
  const contractRequestSteps =
    municipalRows.length > 0
      ? municipalRows.map((entry, idx) => {
          const kn = entry?.cadastralNumber || "—";
          const balanceHolder = entry?.balanceHolder?.name || "не определен";
          const number = entry?.contract?.number;
          return {
            dt: mkDateTime(9 + idx),
            mode: "Автоматически",
            text: `Запрос в ЕИС по балансодержателю ${balanceHolder}: ${number ? `найден контракт №${number}` : "контракт не найден"}`,
            status: number ? "Успешно" : "Ожидание"
          };
        })
      : [
          {
            dt: mkDateTime(9),
            mode: "Автоматически",
            text: "Запрос в ЕИС: пропуск, муниципальные полномочия не обнаружены",
            status: "Успешно"
          }
        ];

  const recommendationStatus = hasAuthorityWarning ? "Ожидание" : "Успешно";
  const recommendationText = hasAuthorityWarning
    ? "Формирование рекомендаций: требуется ручная валидация (смешанные/неоднозначные формы собственности)"
    : `Формирование рекомендаций: правило ${escalationRule ? "подобрано" : "не найдено, использован общий шаблон"}`;

  const auditSteps = [
    {
      dt: mkDateTime(2),
      mode: "Автоматически",
      text: `Поступило сообщение из источника: ${sourceLabel}`,
      status: sourceLabel === "не указан" ? "Ожидание" : "Успешно"
    },
    {
      dt: mkDateTime(3),
      mode: "Автоматически",
      text: "Запрос к ГАР",
      status: garObjectType === "—" ? "Ожидание" : "Успешно"
    },
    { dt: mkDateTime(4), mode: "Автоматически", text: photoText, status: photoStatus },
    { dt: mkDateTime(5), mode: "Автоматически", text: relatedText, status: "Успешно" },
    {
      dt: mkDateTime(6),
      mode: "Автоматически",
      text: `Поиск в Росреестр: найдено записей ${ownerships.length}`,
      status: rosreestrRequestDone ? "Успешно" : "Ожидание"
    },
    {
      dt: mkDateTime(7),
      mode: "Автоматически",
      text: `Определение балансодержателя: ${balanceText}`,
      status: isBalanceHolderDefined ? "Успешно" : "Ошибка"
    },
    {
      dt: mkDateTime(8),
      mode: "Автоматически",
      text: `Определение полномочий: ${authorityRows.length > 0 ? authorityRows.join("; ") : "данные отсутствуют"}`,
      status: authorityRows.length > 0 ? "Успешно" : "Ожидание"
    },
    ...contractRequestSteps,
    {
      dt: mkDateTime(9 + Math.max(municipalRows.length, 1)),
      mode: "Автоматически",
      text: recommendationText,
      status: recommendationStatus
    }
  ];

  const garStepIndex = auditSteps.findIndex((step) => step.text === "Запрос к ГАР");
  const photoStepIndex = auditSteps.findIndex((step) => step.text.startsWith("Сверка мета фото:"));
  const recommendationStepIndex = auditSteps.findIndex((step) =>
    step.text.startsWith("Формирование рекомендаций:")
  );

  const auditRows = [];
  const shouldAnimateAudit = item.status === "Новый";
  for (const step of auditSteps) {
    const modeClass =
      step.mode === "Ручное"
        ? "border-violet-200 bg-violet-50 text-violet-700"
        : "border-sky-200 bg-sky-50 text-sky-700";
    const statusClass =
      step.status === "Успешно"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : step.status === "Ошибка"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-amber-200 bg-amber-50 text-amber-700";
    const modeIcon = step.mode === "Ручное" ? "✍" : "⚙";
    const statusIcon = step.status === "Успешно" ? "✓" : step.status === "Ошибка" ? "✕" : "…";
    const row = document.createElement("div");
    row.className = `text-xs text-slate-900${shouldAnimateAudit ? " hidden" : ""}`;
    row.innerHTML = `
      ${escapeText(step.dt)} | ${escapeText(step.text)}
      <span class="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[11px] font-semibold ${escapeText(
        modeClass
      )}" title="${escapeText(step.mode)}">
        ${escapeText(modeIcon)}
      </span>
      <span class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[11px] font-semibold ${escapeText(
        statusClass
      )}" title="${escapeText(step.status)}">
        ${escapeText(statusIcon)}
      </span>
    `;
    auditRows.push(row);
    audit.appendChild(row);
  }

  updateAuditProgressLabel(
    shouldAnimateAudit ? 0 : auditRows.length,
    auditRows.length,
    !shouldAnimateAudit
  );
  auditBox.appendChild(auditProgress);
  auditBox.appendChild(audit);

  let auditProgressTimer = null;
  let auditProgressFinished = false;
  const stopAuditProgress = () => {
    if (auditProgressTimer) {
      clearInterval(auditProgressTimer);
      auditProgressTimer = null;
    }
  };

  const startAuditProgress = () => {
    if (!shouldAnimateAudit) {
      // Для уже обработанных статусов прогресс не анимируем,
      // но обязательно отправляем события для бейджей/кнопок/рекомендаций.
      if (garStepIndex >= 0) onGarVerified();
      if (photoStepIndex >= 0) onPhotoVerified();
      if (recommendationStepIndex >= 0) getOnRecommendationReady()?.();
      activateContextTab("jurisdiction");
      return;
    }
    stopAuditProgress();
    auditProgressFinished = false;
    let garBadgeActivated = false;
    let photoBadgeActivated = false;
    let recommendationActivated = false;
    auditRows.forEach((row) => row.classList.add("hidden"));
    activateContextTab("audit");
    let index = 0;
    updateAuditProgressLabel(0, auditRows.length);
    auditProgressTimer = setInterval(() => {
      if (index >= auditRows.length) {
        stopAuditProgress();
        if (!auditProgressFinished) {
          auditProgressFinished = true;
          updateAuditProgressLabel(auditRows.length, auditRows.length, true);
          activateContextTab("jurisdiction");
        }
        return;
      }
      auditRows[index].classList.remove("hidden");
      if (!garBadgeActivated && garStepIndex >= 0 && index === garStepIndex) {
        garBadgeActivated = true;
        onGarVerified();
      }
      if (!photoBadgeActivated && photoStepIndex >= 0 && index === photoStepIndex) {
        photoBadgeActivated = true;
        onPhotoVerified();
      }
      if (!recommendationActivated && recommendationStepIndex >= 0 && index === recommendationStepIndex) {
        recommendationActivated = true;
        getOnRecommendationReady()?.();
      }
      index += 1;
      updateAuditProgressLabel(index, auditRows.length);
    }, 1000);
  };

  return { auditBox, startAuditProgress, stopAuditProgress };
}
