import { POINT_STATUSES } from "./constants.js";

export function createModalActionsBox({
  ui,
  item,
  relatedPoints,
  currentItemRef,
  onClose,
  useAssignmentFlow,
  useProcurementFlow,
  contract,
  contractor,
  deadlineStr,
  attachmentLabel,
  category,
  escalationRule,
  statusToDraftLabel,
  status,
  primaryOwnershipForm,
  city,
  escapeText,
  getAllowedTransitions,
  onTransitionRequest
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "space-y-3 flex flex-col h-full";
  const isUnderReview = status === POINT_STATUSES.UNDER_REVIEW;
  const isCompleted = status === POINT_STATUSES.COMPLETED;
  const isCanceled = status === POINT_STATUSES.CANCELED;
  const primaryRelatedPoint = relatedPoints[0] || null;
  const duplicateRelatedLabel =
    relatedPoints.length > 0
      ? relatedPoints.map((point) => escapeText(point?.id || "—")).join(", ")
      : "не найдены";
  const currentPhotoSource = String(item?.photoGallery?.[0]?.source || "").trim();
  const relatedPhotoSource = String(primaryRelatedPoint?.photoGallery?.[0]?.source || "").trim();
  const hasSamePhoto = Boolean(currentPhotoSource && relatedPhotoSource && currentPhotoSource === relatedPhotoSource);
  const currentGarCoordinate = String(item?.gar?.coordinate || "").trim();
  const relatedGarCoordinate = String(primaryRelatedPoint?.gar?.coordinate || "").trim();
  const hasSameGarCoordinate = Boolean(
    currentGarCoordinate && relatedGarCoordinate && currentGarCoordinate === relatedGarCoordinate
  );
  const currentAddress = String(item?.address || "").trim();
  const relatedAddress = String(primaryRelatedPoint?.address || "").trim();
  const hasSameAddress = Boolean(currentAddress && relatedAddress && currentAddress === relatedAddress);
  const currentTheme = String(item?.theme || "").trim();
  const relatedTheme = String(primaryRelatedPoint?.theme || "").trim();
  const hasSameTheme = Boolean(currentTheme && relatedTheme && currentTheme === relatedTheme);
  const currentCategory = String(category || "").trim();
  const relatedCategory = String(primaryRelatedPoint?.requestType || "").trim();
  const hasSameCategory = Boolean(currentCategory && relatedCategory && currentCategory === relatedCategory);

  const tabsWrap = document.createElement("div");
  tabsWrap.className = "rounded-xl border border-slate-200 bg-white overflow-hidden";

  const tabsBar = document.createElement("div");
  tabsBar.className = "flex flex-wrap items-end gap-1 bg-slate-50 border-b border-slate-200 px-2 pt-2";

  const panelText = ui.createPaddedSection();
  panelText.innerHTML = `
    <div class="mb-2 flex flex-wrap items-center gap-2">
      <div class="text-xs font-semibold text-slate-900">${
        isCanceled
          ? "Текст закрытия"
          : useAssignmentFlow
          ? "Текст поручения"
          : useProcurementFlow
            ? "Текст включения в план закупок"
            : "Текст эскалации"
      }</div>
      <span data-recommendation-badge class="hidden inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">по рекомендации</span>
    </div>
    <div data-recommendation-wait class="text-xs text-slate-500">Ожидание шага "Формирование рекомендаций" в аудит-логе...</div>
    <div data-recommendation-text class="hidden text-xs text-slate-700 whitespace-pre-line">${
      isCanceled
        ? `Закрыть сообщение как дублирующее.
Связанное сообщение: ${duplicateRelatedLabel}.
Статус: ${escapeText(statusToDraftLabel(status))}.`
        : useAssignmentFlow
        ? `Направить подрядчику ${escapeText(contractor)} поручение на устранение дефекта.
Адрес: ${escapeText(item.address || "—")}.
Суть: ${escapeText(item.theme || "—")}.
Срок исполнения: до ${escapeText(deadlineStr)} (SLA: 5 дней).
Основание: п.3.1 Договора №45/25.
Приложения: ${escapeText(attachmentLabel)}.`
        : useProcurementFlow
          ? `Включить сообщение в план закупок муниципалитета.
Категория: ${escapeText(category)}.
Адрес: ${escapeText(item.address || "—")}.
Основание: контрактные обязательства не найдены.
Пакет: описание дефекта, фотофиксация, обоснование потребности.`
          : `Эскалировать сообщение по компетенции.
Категория: ${escapeText(category)}.
Куда: ${escapeText(escalationRule?.to || "Не определено в rules")}.
Основание: ${escapeText(escalationRule?.basis || "Не определено в rules")}.
Приложения: ${escapeText(escalationRule?.attachments || "Добавьте пакет вручную")}.`
    }</div>
  `;
  const recommendationTextBadge = panelText.querySelector("[data-recommendation-badge]");
  const recommendationTextBody = panelText.querySelector("[data-recommendation-text]");
  const recommendationTextWait = panelText.querySelector("[data-recommendation-wait]");
  const revealRecommendationText = () => {
    const actionsRow = wrapper.querySelector("[data-user-actions-row]");
    recommendationTextBadge?.classList.remove("hidden");
    recommendationTextBody?.classList.remove("hidden");
    recommendationTextWait?.classList.add("hidden");
    actionsRow?.classList.remove("hidden");
  };
  const hideRecommendationText = () => {
    const actionsRow = wrapper.querySelector("[data-user-actions-row]");
    recommendationTextBadge?.classList.add("hidden");
    recommendationTextBody?.classList.add("hidden");
    recommendationTextWait?.classList.remove("hidden");
    actionsRow?.classList.add("hidden");
  };

  const panelRecommendation = document.createElement("div");
  panelRecommendation.className = "p-3 hidden";
  panelRecommendation.innerHTML = `
    <div class="text-xs font-semibold text-slate-900">${
      isCanceled
        ? "🗂️ Закрыть как дубликат ← РЕКОМЕНДУЕТСЯ"
        : useAssignmentFlow
        ? "✉️ Создать поручение подрядчику ← РЕКОМЕНДУЕТСЯ"
        : useProcurementFlow
          ? "🗂️ Включить в план закупок ← РЕКОМЕНДУЕТСЯ"
          : "📤 Эскалировать сообщение ← РЕКОМЕНДУЕТСЯ"
    }</div>
    <div class="text-xs text-slate-600 mt-2 whitespace-pre-line">${
      isCanceled
        ? `• Решение: закрыть сообщение как дублирующее
• Связанное сообщение: ${duplicateRelatedLabel}
• Действие: не создавать новое поручение
• Статус: ${escapeText(statusToDraftLabel(status))}`
        : useAssignmentFlow
        ? `• Исполнитель: ${escapeText(contractor)}
• Срок исполнения: ${escapeText(deadlineStr)} (5 дней)
• Основание: п.3.1 Договора №45/25
• Шаблон: «Уведомление о дефекте с фотофиксацией»
• Статус: ${escapeText(statusToDraftLabel(status))}`
        : useProcurementFlow
          ? `• Полномочия: ${escapeText(primaryOwnershipForm || "не определены")}
• Решение: включить задачу в план закупок
• Основание: контрактные обязательства отсутствуют
• Пакет: дефектовка, фото, расчет объема работ
• Статус: ${escapeText(statusToDraftLabel(status))}`
          : `• Полномочия: ${escapeText(primaryOwnershipForm || "не определены")}
• Куда эскалировать: ${escapeText(escalationRule?.to || "не найдено правило")}
• Основание: ${escapeText(escalationRule?.basis || "не найдено правило")}
• Пакет: ${escapeText(escalationRule?.attachments || "сформировать вручную")}
• Статус: ${escapeText(statusToDraftLabel(status))}`
    }</div>
  `;

  const panelWhy = document.createElement("div");
  panelWhy.className = "p-3 hidden";
  const whyTitle = document.createElement("div");
  whyTitle.className = "text-xs font-semibold text-slate-900";
  whyTitle.textContent = "🔍 Почему система это предлагает";
  panelWhy.appendChild(whyTitle);
  const whyItems = document.createElement("div");
  whyItems.className = "mt-2";
  const whyBullets = isCanceled
    ? [
        "Повторное обращение без новых материалов",
        `Совпадение адреса: ${hasSameAddress ? "идентичен" : "не подтверждено"}`,
        `Совпадение категории/темы: ${
          hasSameCategory && hasSameTheme ? "идентичны" : hasSameCategory ? "категория идентична" : "не подтверждено"
        }`,
        `Совпадение фото: ${hasSamePhoto ? "идентично" : "не подтверждено"}`,
        `Совпадение координат/ГАР: ${hasSameGarCoordinate ? "идентично" : "не подтверждено"}`,
        `Связанное сообщение: ${duplicateRelatedLabel}`
      ]
    : [
        `Адрес: ${city}`,
        `Категория: ${category}`,
        useAssignmentFlow
          ? "Муниципальные полномочия → можно сформировать поручение исполнителю"
          : useProcurementFlow
            ? "Муниципальные полномочия + нет контракта → включение в план закупок"
            : "Поручение по договору недоступно → нужна эскалация по матрице rules",
        useAssignmentFlow
          ? "В ЕИС найден действующий контракт → можно направить требование"
          : useProcurementFlow
            ? "Контрактные обязательства не найдены → требуется закупочная процедура"
            : `Точка эскалации: ${escalationRule?.to || "не определена"}`,
        useAssignmentFlow
          ? `SLA: 5 дней → дедлайн: ${deadlineStr}`
          : useProcurementFlow
            ? "Действие: сформировать карточку в план закупок"
            : `Нормативка: ${escalationRule?.basis || "не определена"}`
      ];
  ui.createBulletList(whyItems, whyBullets);
  panelWhy.appendChild(whyItems);

  const whyLinks = document.createElement("div");
  whyLinks.className = "mt-3 flex flex-wrap gap-2";
  const mkLink = (text) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "text-xs font-semibold text-slate-900 hover:underline";
    a.textContent = text;
    a.addEventListener("click", (e) => e.preventDefault());
    return a;
  };
  whyLinks.appendChild(mkLink("❓ Оспорить рекомендацию"));
  whyLinks.appendChild(mkLink("📥 Скачать обоснование"));
  panelWhy.appendChild(whyLinks);

  const panelRelatedActions = document.createElement("div");
  panelRelatedActions.className = "p-3 hidden";
  const relatedActionsTitle = document.createElement("div");
  relatedActionsTitle.className = "text-xs font-semibold text-slate-900";
  relatedActionsTitle.textContent = "Похожие сообщения";
  panelRelatedActions.appendChild(relatedActionsTitle);

  const bulkSelection = new Set();
  const bulkPoints = [item, ...relatedPoints.filter((p) => p?.id !== item?.id)];
  const hasOnlyCurrentRelated = bulkPoints.length === 1;
  const relatedActionsBody = document.createElement("div");
  relatedActionsBody.className = "mt-2 space-y-2";

  if (bulkPoints.length === 0) {
    const empty = document.createElement("div");
    empty.className = "text-xs text-slate-600";
    empty.textContent = "Нет связанных сообщений для массового действия.";
    relatedActionsBody.appendChild(empty);
  } else {
    bulkPoints.forEach((relatedPoint) => {
      const row = document.createElement("label");
      row.className =
        "flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 cursor-pointer hover:bg-slate-50";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.className = "mt-0.5 accent-slate-900";
      bulkSelection.add(relatedPoint.id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) bulkSelection.add(relatedPoint.id);
        else bulkSelection.delete(relatedPoint.id);
        updateBulkActionLabel();
      });
      const meta = document.createElement("div");
      meta.className = "min-w-0";
      meta.innerHTML = `
        <div class="flex flex-wrap items-center gap-2">
          <div class="text-xs font-semibold text-slate-900">${escapeText(relatedPoint.theme || relatedPoint.id)}</div>
          ${
            relatedPoint.id === item.id
              ? '<span class="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">текущее</span>'
              : ""
          }
        </div>
        <div class="text-[11px] text-slate-600 mt-0.5">${escapeText(relatedPoint.address || "—")}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">ID: ${escapeText(relatedPoint.id)} · ${escapeText(
        relatedPoint.status || "—"
      )}</div>
      `;
      row.appendChild(checkbox);
      row.appendChild(meta);
      relatedActionsBody.appendChild(row);
    });
  }
  panelRelatedActions.appendChild(relatedActionsBody);

  const panels = {
    text: panelText,
    recommendation: panelRecommendation,
    why: panelWhy,
    relatedActions: panelRelatedActions
  };

  const tabButtons = {};
  const makeTab = (key, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rounded-t-lg px-3 py-1.5 text-xs font-medium transition border";
    btn.textContent = label;
    btn.addEventListener("click", () => activateTab(key));
    tabButtons[key] = btn;
    tabsBar.appendChild(btn);
  };

  const activateTab = (key) => {
    Object.entries(panels).forEach(([k, panel]) => {
      panel.classList.toggle("hidden", k !== key);
    });
    Object.entries(tabButtons).forEach(([k, btn]) => {
      const active = k === key;
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

  makeTab("text", "Текст поручения");
  makeTab("recommendation", "Рекомендация");
  makeTab("why", "Почему");
  makeTab("relatedActions", "Похожие сообщения");
  activateTab("text");

  tabsWrap.appendChild(tabsBar);
  tabsWrap.appendChild(panelText);
  tabsWrap.appendChild(panelRecommendation);
  tabsWrap.appendChild(panelWhy);
  tabsWrap.appendChild(panelRelatedActions);

  const hasCompletionReport = isUnderReview || isCompleted;
  if (hasCompletionReport) {
    const reportBox = ui.createPaddedSection();
    reportBox.className = "rounded-xl border border-emerald-200 bg-white px-3 py-3";
    const completedAt = item.plannedCloseAt || item.createdAt || "—";
    const reportBadgeLabel = isCompleted ? "Принято" : "Выполнено";
    const contractNumber = contract?.number || "—";
    const contractSla = contract?.sla || "—";
    const contractPenalty = contract?.penalty || "—";
    const hasContractDetails = Boolean(contract);
    const ownerships = Array.isArray(item?.ownerships) ? item.ownerships : [];
    const balanceHolderNames = [
      ...new Set(
        ownerships
          .map((entry) => String(entry?.balanceHolder?.name || "").trim())
          .filter(Boolean)
      )
    ];
    const cadastralNumbers = [
      ...new Set(
        ownerships
          .map((entry) => String(entry?.cadastralNumber || "").trim())
          .filter(Boolean)
      )
    ];
    const balanceHolderLabel = balanceHolderNames.length > 0 ? balanceHolderNames.join(", ") : "не определен";
    const cadastralNumbersLabel = cadastralNumbers.length > 0 ? cadastralNumbers.join(", ") : "—";
    const isEscalationFlow = !useAssignmentFlow && !useProcurementFlow;
    const escalationTarget = escalationRule?.to || "не определено";
    const escalationBasis = escalationRule?.basis || "не определено";
    const escalationAttachments = escalationRule?.attachments || "сформировать вручную";
    reportBox.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="text-sm font-semibold text-slate-900">Отчет по выполненным работам</div>
        <span class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
          ${reportBadgeLabel}
        </span>
      </div>
      <div class="mt-3 space-y-1.5 text-xs text-slate-700">
        ${
          hasContractDetails
            ? `<div><span class="text-slate-500">Подрядчик:</span> ${escapeText(contractor)}</div>
        <div><span class="text-slate-500">Договор:</span> ${escapeText(`№ ${contractNumber}`)}</div>
        <div><span class="text-slate-500">SLA по договору:</span> ${escapeText(contractSla)}</div>`
            : `<div><span class="text-slate-500">Балансодержатель:</span> ${escapeText(balanceHolderLabel)}</div>
        <div><span class="text-slate-500">Кадастровые номера:</span> ${escapeText(cadastralNumbersLabel)}</div>`
        }
        <div><span class="text-slate-500">Дата завершения:</span> ${escapeText(completedAt)}</div>
        <div><span class="text-slate-500">Адрес:</span> ${escapeText(item.address || "—")}</div>
        <div><span class="text-slate-500">Результат:</span> ${
          isEscalationFlow
            ? "сообщение эскалировано по компетенции, пакет материалов сформирован."
            : `дефект устранен, фото до/после загружены, контрольный осмотр выполнен${
                hasContractDetails ? ", обязательства по договору исполнены." : "."
              }`
        }</div>
        ${
          isEscalationFlow
            ? `<div><span class="text-slate-500">Эскалация:</span> ${escapeText(escalationTarget)}</div>
        <div><span class="text-slate-500">Основание:</span> ${escapeText(escalationBasis)}</div>
        <div><span class="text-slate-500">Пакет для эскалации:</span> ${escapeText(escalationAttachments)}</div>`
            : ""
        }
        ${
          hasContractDetails
            ? `<div><span class="text-slate-500">Штрафные санкции:</span> ${escapeText(contractPenalty)}</div>`
            : ""
        }
        <div class="pt-1 flex items-center gap-3">
          <a href="#" class="text-xs font-semibold text-slate-900 hover:underline">Скачать XML</a>
          <a href="#" class="text-xs font-semibold text-slate-900 hover:underline">Скачать PDF</a>
        </div>
      </div>
    `;
    wrapper.appendChild(reportBox);
  }

  const shouldShowRecommendationTabs = !isCompleted && !isUnderReview;

  const row = document.createElement("div");
  row.className = `${isCompleted || isUnderReview ? "" : "hidden "}flex flex-wrap gap-3 items-center mt-auto pt-3`;
  row.setAttribute("data-user-actions-row", "true");

  const mkBtn = ({ label, className, onClick }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = label;
    btn.addEventListener("click", onClick);
    return btn;
  };

  const requestTransition = (nextStatus) => {
    if (typeof onTransitionRequest !== "function" || !nextStatus) return false;
    try {
      onTransitionRequest(nextStatus);
      return true;
    } catch (error) {
      console.warn("Status transition rejected:", error);
      window.alert(`Невозможно сменить статус: ${error?.message || "неизвестная ошибка"}`);
      return false;
    }
  };

  const allowedTransitions = Array.isArray(getAllowedTransitions?.(status))
    ? getAllowedTransitions(status)
    : [];

  const resolvePrimaryTargetStatus = () => {
    if (isCompleted) return null;
    if (status === POINT_STATUSES.UNDER_REVIEW) return POINT_STATUSES.COMPLETED;
    if (status === POINT_STATUSES.NEW) return POINT_STATUSES.IN_PROGRESS;
    if (status === POINT_STATUSES.IN_PROGRESS) return POINT_STATUSES.UNDER_REVIEW;
    if (status === POINT_STATUSES.SUSPENDED) return POINT_STATUSES.IN_PROGRESS;
    return null;
  };

  const resolveRejectTargetStatus = () => {
    if (isCompleted) return null;
    if (status === POINT_STATUSES.UNDER_REVIEW) return POINT_STATUSES.IN_PROGRESS;
    return POINT_STATUSES.CANCELED;
  };

  const bulkBtn = mkBtn({
    label: isUnderReview
      ? "Принять по всем"
      : useAssignmentFlow
        ? "Утвердить по всем"
        : useProcurementFlow
          ? "Запланировать по всем"
          : "Эскалировать по всем",
    className: useAssignmentFlow
      ? "rounded-xl bg-emerald-100 text-emerald-900 px-4 py-2 text-sm font-semibold border border-emerald-200 shadow-sm hover:bg-emerald-200 transition"
      : useProcurementFlow
        ? "rounded-xl bg-amber-100 text-amber-900 px-4 py-2 text-sm font-semibold border border-amber-200 shadow-sm hover:bg-amber-200 transition"
        : "rounded-xl bg-blue-100 text-blue-900 px-4 py-2 text-sm font-semibold border border-blue-200 shadow-sm hover:bg-blue-200 transition",
    onClick: () => {
      if (bulkSelection.size === 0 || hasOnlyCurrentRelated) return;
      onClose();
    }
  });

  const updateBulkActionLabel = () => {
    const selectedCount = bulkSelection.size;
    const base = isUnderReview
      ? "Принять по всем"
      : useAssignmentFlow
        ? "Утвердить по всем"
        : useProcurementFlow
          ? "Запланировать по всем"
          : "Эскалировать по всем";
    bulkBtn.textContent = selectedCount > 0 ? `${base} (${selectedCount})` : base;
    const shouldDisable = selectedCount === 0 || hasOnlyCurrentRelated;
    bulkBtn.disabled = shouldDisable;
    bulkBtn.classList.toggle("opacity-50", shouldDisable);
    bulkBtn.classList.toggle("cursor-not-allowed", shouldDisable);
  };
  updateBulkActionLabel();

  row.appendChild(
    mkBtn({
      label: isCompleted
        ? "Отправить отчет"
        : useAssignmentFlow
          ? isUnderReview
            ? "Принять"
            : "Утвердить поручение"
          : useProcurementFlow
            ? isUnderReview
              ? "Принять"
              : "Запланировать"
            : isUnderReview
              ? "Принять"
              : "Эскалировать",
      className: useAssignmentFlow
        ? "rounded-xl bg-emerald-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-800 transition"
        : useProcurementFlow
          ? "rounded-xl bg-amber-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-amber-800 transition"
          : "rounded-xl bg-blue-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-blue-800 transition",
      onClick: () => {
        const currentItem = currentItemRef();
        if (!currentItem) return;
        const primaryTargetStatus = resolvePrimaryTargetStatus();
        if (!primaryTargetStatus) {
          window.open(currentItem.source, "_blank", "noreferrer");
          onClose();
          return;
        }
        if (!allowedTransitions.includes(primaryTargetStatus)) {
          window.alert(`Недоступный переход статуса: ${status} -> ${primaryTargetStatus}`);
          return;
        }
        if (requestTransition(primaryTargetStatus)) onClose();
      }
    })
  );
  if (!isCompleted) {
    row.appendChild(bulkBtn);
  }

  row.appendChild(
    mkBtn({
      label: isCompleted ? "В архив" : "Редактировать",
      className:
        "rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium shadow-sm transition",
      onClick: () => onClose()
    })
  );

  if (!isCompleted) {
    row.appendChild(
      mkBtn({
        label: isUnderReview ? "Вернуть на доработку" : "Отклонить",
        className:
          "rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-sm font-medium text-rose-800 shadow-sm transition",
        onClick: () => {
          const rejectTargetStatus = resolveRejectTargetStatus();
          if (!rejectTargetStatus) return;
          if (!allowedTransitions.includes(rejectTargetStatus)) {
            window.alert(`Недоступный переход статуса: ${status} -> ${rejectTargetStatus}`);
            return;
          }
          if (requestTransition(rejectTargetStatus)) onClose();
        }
      })
    );
  }

  if (!isCompleted) {
    hideRecommendationText();
    if (shouldShowRecommendationTabs) {
      wrapper.appendChild(tabsWrap);
    }
  }
  wrapper.appendChild(row);

  return {
    actionsBox: wrapper,
    onRecommendationReady: shouldShowRecommendationTabs ? revealRecommendationText : () => {}
  };
}
