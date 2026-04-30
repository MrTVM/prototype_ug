import { el, escapeHtml, indexById } from "./utils.js";
import { OWNERSHIP_FORMS, POINT_STATUSES, points, rules, statusToBadge } from "./constants.js";
import { createUiFactory } from "./uiFactory.js";
import { createModalActionsBox } from "./modalActions.js";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatRuDateTime(d) {
  const date = `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
  const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  return `${date} ${time}`;
}

function getCity(addressStr) {
  const first = String(addressStr || "").split(",")[0].trim();
  return first || "—";
}

function formatCoords(coords) {
  if (Array.isArray(coords) && coords.length >= 2) return `${coords[0]}, ${coords[1]}`;
  return "—";
}

function parseCoords(coords) {
  if (Array.isArray(coords) && coords.length >= 2) {
    return [Number(coords[0]), Number(coords[1])];
  }
  const raw = String(coords || "").trim();
  if (!raw) return null;
  const parts = raw.split(",").map((v) => Number(String(v).trim()));
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  return [parts[0], parts[1]];
}

function distanceMeters(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const earthRadiusM = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earthRadiusM * y;
}

function extractDatePart(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const isoDateMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDateMatch) return isoDateMatch[1];
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
}

function createInlineFallbackImage(seed, index) {
  const label = `Фото недоступно #${index + 1}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#334155">${label}</text>
  <text x="600" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#475569">Источник: ${seed}</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizePhotoSource(source, seed, index) {
  const src = String(source || "").trim();
  if (!src) return createInlineFallbackImage(seed, index);
  // В прототипе исключаем внешние нестабильные источники (picsum), чтобы UI не зависел от сети.
  if (/^https?:\/\/picsum\.photos\//i.test(src)) {
    return createInlineFallbackImage(seed, index);
  }
  return src;
}

function escapeText(str) {
  return escapeHtml(str);
}

function resolveAuthorityLevel(ownershipForm) {
  const normalized = String(ownershipForm || "").toLowerCase().trim();
  if (normalized.includes("муницип")) return "municipal";
  if (normalized.includes("регион")) return "regional";
  if (normalized.includes("част")) return "private";
  if (normalized.includes("федерал")) return "federal";
  return "federal";
}

const DEFAULT_DRAFT_LABEL = "🟡 Черновик (требует согласования)";
const draftLabelByStatus = {
  [POINT_STATUSES.NEW]: DEFAULT_DRAFT_LABEL,
  [POINT_STATUSES.IN_PROGRESS]: DEFAULT_DRAFT_LABEL,
  [POINT_STATUSES.UNDER_REVIEW]: DEFAULT_DRAFT_LABEL,
  [POINT_STATUSES.COMPLETED]: "🟢 Завершено (можно закрывать)",
  [POINT_STATUSES.SUSPENDED]: "🟠 На паузе (ожидает уточнений)",
  [POINT_STATUSES.CANCELED]: "🔴 Отменено (закрыто)"
};

function statusToDraftLabel(status) {
  return draftLabelByStatus[status] || DEFAULT_DRAFT_LABEL;
}

export function createModal() {
  const ui = createUiFactory();
  const modal = el("modal");
  const closeBtn = el("modal-close");
  const overlay = el("modal-overlay");

  const title = el("modal-title");
  const address = el("modal-address");
  const summary = el("modal-summary");
  const photoMain = el("modal-photo-main");
  const photoPrev = el("modal-photo-prev");
  const photoNext = el("modal-photo-next");
  const photoThumbs = el("modal-photo-thumbs");
  const rightColumn = el("modal-right-column");
  const hint = el("modal-hint");
  const leftActions = el("modal-left-actions");

  if (!modal) throw new Error('Missing element: "modal"');
  if (!rightColumn) throw new Error('Missing element: "modal-right-column"');
  if (!hint) throw new Error('Missing element: "modal-hint"');
  if (!leftActions) throw new Error('Missing element: "modal-left-actions"');
  if (!summary) throw new Error('Missing element: "modal-summary"');
  if (!photoMain || !photoThumbs || !photoPrev || !photoNext) {
    throw new Error('Missing photo carousel elements');
  }

  let isOpen = false;
  let currentItem = null;
  let startAuditProgressRef = null;
  let stopAuditProgressRef = null;
  let currentPhotos = [];
  let currentPhotoMetas = [];
  let currentPhotoIndex = 0;
  const pointsById = indexById(points);

  const ensurePhotoBadge = () => {
    const host = photoMain?.parentElement;
    if (!host) {
      console.log("[photo-badge] host not found", { photoMainExists: Boolean(photoMain) });
      return null;
    }

    let badge = el("modal-photo-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "modal-photo-badge";
      host.appendChild(badge);
    }
    badge.style.position = "absolute";
    badge.style.left = "12px";
    badge.style.top = "12px";
    badge.style.zIndex = "30";
    badge.style.display = "inline-flex";
    badge.style.alignItems = "center";
    badge.style.gap = "4px";
    badge.style.padding = "4px 10px";
    badge.style.borderRadius = "9999px";
    badge.style.fontSize = "12px";
    badge.style.fontWeight = "600";
    badge.style.boxShadow = "0 1px 2px rgba(0,0,0,0.08)";
    badge.style.pointerEvents = "none";
    badge.className =
      "absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm";

    let icon = el("modal-photo-badge-icon");
    if (!icon) {
      icon = document.createElement("span");
      icon.id = "modal-photo-badge-icon";
      icon.setAttribute("aria-hidden", "true");
      badge.appendChild(icon);
    }
    if (!icon.textContent) icon.textContent = "⏳";

    let text = el("modal-photo-badge-text");
    if (!text) {
      text = document.createElement("span");
      text.id = "modal-photo-badge-text";
      badge.appendChild(text);
    }
    if (!text.textContent) text.textContent = "Проверка фото...";
    return { badge, icon, text };
  };

  const renderPhotoCarousel = (item) => {
    const seedBase = String(item.id || "fallback");
    const fallbackGallery = [
      createInlineFallbackImage(seedBase, 0),
      createInlineFallbackImage(seedBase, 1),
      createInlineFallbackImage(seedBase, 2)
    ];

    const sourceGallery = Array.isArray(item.photoGallery)
      ? item.photoGallery
      : item.photoSrc
        ? [{ source: item.photoSrc, meta: {} }]
        : [];

    let photoEntries = sourceGallery
      .map((photo, idx) => {
        const normalized = typeof photo === "string" ? { source: photo, meta: {} } : photo;
        return {
          ...normalized,
          source: normalizePhotoSource(normalized?.source, seedBase, idx)
        };
      })
      .filter((photo) => Boolean(photo?.source));
    if (photoEntries.length === 0) {
      photoEntries = fallbackGallery.map((src) => ({ source: src, meta: {} }));
    } else if (photoEntries.length === 1) {
      // Даже при одном фото оставляем возможность листания на fallback-кадры.
      photoEntries = [
        photoEntries[0],
        { source: fallbackGallery[1], meta: {} },
        { source: fallbackGallery[2], meta: {} }
      ];
    }
    currentPhotos = photoEntries.map((photo) => photo.source);
    currentPhotoMetas = photoEntries.map((photo) => photo.meta || {});

    currentPhotoIndex = 0;

    const updatePhotoBadge = () => {
      const badgeNodes = ensurePhotoBadge();
      if (!badgeNodes) {
        console.log("[photo-badge] update skipped: badge nodes missing");
        return;
      }
      const { badge, icon, text } = badgeNodes;
      const photoMeta = currentPhotoMetas[currentPhotoIndex] || {};
      const pointCoords = parseCoords(item.coords);
      const photoCoords = parseCoords(photoMeta.coordinates || photoMeta.geoCoordinates);
      const pointDate = extractDatePart(item.createdAt);
      const photoUpdatedDate = extractDatePart(photoMeta.updatedAt || photoMeta.updated_at);
      const geoMatches =
        Boolean(pointCoords && photoCoords) && distanceMeters(pointCoords, photoCoords) <= 200;
      const dateMatches = Boolean(pointDate) && pointDate === photoUpdatedDate;
      const isVerified = geoMatches && dateMatches;
      console.log("[photo-badge] update", {
        currentPhotoIndex,
        photoMeta,
        pointCoords,
        photoCoords,
        pointDate,
        photoUpdatedDate,
        geoMatches,
        dateMatches,
        isVerified
      });

      badge.style.border = isVerified ? "1px solid #a7f3d0" : "1px solid #fde68a";
      badge.style.background = isVerified ? "rgba(236,253,245,0.95)" : "rgba(255,251,235,0.95)";
      badge.style.color = isVerified ? "#065f46" : "#92400e";
      badge.className = `absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
        isVerified
          ? "border border-emerald-200 bg-emerald-50/95 text-emerald-800"
          : "border border-amber-200 bg-amber-50/95 text-amber-900"
      }`;
      icon.textContent = isVerified ? "✅" : "⚠️";
      text.textContent = isVerified ? "Фото проверено" : "Фото требует проверки";
    };

    const applyMain = () => {
      photoMain.src = currentPhotos[currentPhotoIndex];
      photoMain.alt = `Фото ${currentPhotoIndex + 1}`;
      photoMain.onerror = () => {
        photoMain.onerror = null;
        photoMain.src = fallbackGallery[currentPhotoIndex % fallbackGallery.length];
      };
      photoPrev.classList.toggle("hidden", currentPhotos.length <= 1);
      photoNext.classList.toggle("hidden", currentPhotos.length <= 1);
      updatePhotoBadge();
    };

    const renderThumbs = () => {
      photoThumbs.innerHTML = "";
      currentPhotos.slice(0, 8).forEach((src, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rounded-lg border border-slate-200 overflow-hidden bg-white";
        if (idx === currentPhotoIndex) btn.classList.add("ring-2", "ring-slate-400");
        btn.innerHTML = `<img src="${escapeText(src)}" alt="Превью ${idx + 1}" class="w-full h-14 object-cover" />`;
        const img = btn.querySelector("img");
        if (img) {
          img.onerror = () => {
            img.onerror = null;
            img.src = fallbackGallery[idx % fallbackGallery.length];
          };
        }
        btn.addEventListener("click", () => {
          currentPhotoIndex = idx;
          applyMain();
          renderThumbs();
        });
        photoThumbs.appendChild(btn);
      });
    };

    photoPrev.onclick = () => {
      currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
      applyMain();
      renderThumbs();
    };
    photoNext.onclick = () => {
      currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
      applyMain();
      renderThumbs();
    };

    applyMain();
    renderThumbs();
  };

  const buildStructured = (item, options = {}) => {
    const onGarVerified = typeof options.onGarVerified === "function" ? options.onGarVerified : () => {};
    const onPhotoVerified = typeof options.onPhotoVerified === "function" ? options.onPhotoVerified : () => {};
    let onRecommendationReady =
      typeof options.onRecommendationReady === "function" ? options.onRecommendationReady : () => {};
    const now = new Date(item.createdAt);
    const city = getCity(item.address);
    const coords = formatCoords(item.coords);
    const gar = item.gar || {};
    const garCoordinate = gar.coordinate || coords;
    const garObjectType = gar.objectType || "—";
    const garMunicipalDistrict = gar.municipalDistrict || "—";
    const ownerships = Array.isArray(item.ownerships) ? item.ownerships : [];
    const ownershipFormsList = ownerships
      .map((entry) => String(entry?.ownershipForm || "").toLowerCase().trim())
      .filter(Boolean);
    const uniqueOwnershipForms = [...new Set(ownershipFormsList)];
    const ownershipForms = uniqueOwnershipForms.join(" ");
    const primaryOwnershipForm = uniqueOwnershipForms[0] || "";
    const resolvedAuthorityLevel = resolveAuthorityLevel(primaryOwnershipForm);
    const isMunicipalAuthority = resolvedAuthorityLevel === "municipal";
    const authoritySource = `${item.authority || ""} ${ownershipForms}`.toLowerCase();
    const authorityValue = authoritySource.includes("част")
      ? "частный"
      : authoritySource.includes("муницип")
        ? "муниципальный"
        : authoritySource.includes("регион")
          ? "региональный"
          : "федеральный";
    const hasAuthorityWarning =
      uniqueOwnershipForms.length > 1 ||
      (uniqueOwnershipForms.length === 1 && uniqueOwnershipForms[0] !== OWNERSHIP_FORMS.MUNICIPAL);
    const balanceHolderNames = ownerships
      .map((entry) => entry?.balanceHolder?.name?.trim())
      .filter(Boolean);
    const uniqueBalanceHolderNames = [...new Set(balanceHolderNames)];
    const isBalanceHolderDefined =
      uniqueBalanceHolderNames.length > 0 &&
      uniqueBalanceHolderNames.some((name) => !/не определ/i.test(name));
    const contract =
      ownerships.find((entry) => entry?.contract)?.contract || null;
    const hasContract = Boolean(contract);
    const useAssignmentFlow = isMunicipalAuthority && hasContract;
    const useProcurementFlow = isMunicipalAuthority && !hasContract;
    const complaintNo = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${(parseInt(
      String(item.id || "").replace(/\D/g, "").slice(-4) || "1234",
      10
    ) % 9000) + 1000}`;

    const received = `${pad2(now.getDate())}.${pad2(now.getMonth() + 1)}.${now.getFullYear()} ${pad2(
      now.getHours()
    )}:${pad2(now.getMinutes())}`;

    // Подстановка из данных (прототипные значения, но зависят от переданного item)
    const category = item.requestType || "—";
    const escalationRule =
      rules?.[category]?.[resolvedAuthorityLevel] || null;
    const applicant = item.applicant || {};
    const applicantFioRaw = String(applicant.fio || "").trim();
    const fioParts = applicantFioRaw.split(/\s+/).filter(Boolean);
    const applicantFio =
      fioParts.length >= 3
        ? `${fioParts[1]} ${fioParts[2]} ${fioParts[0].charAt(0)}.`
        : applicantFioRaw || "Не указан";
    const applicantPhoneMasked = "скрыт";
    const description = item.description || "";
    const primaryPhoto =
      Array.isArray(item.photoGallery) && item.photoGallery.length > 0
        ? typeof item.photoGallery[0] === "string"
          ? item.photoGallery[0]
          : item.photoGallery[0]?.source
        : item.photoSrc;
    const photoName = primaryPhoto
      ? String(primaryPhoto)
          .split("/")
          .pop()
          .split("?")[0]
          .trim()
      : "";
    const attachmentLabel = primaryPhoto ? `🖼️ ${photoName || "фото"}` : "—";
    const status = item.status || "—";

    const recommendedDeadline = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const contractor =
      /дорог|благо|территор|коммун/i.test(String(item.theme || "")) ? "ООО «Асфальт»" : "ООО «Спектр»";

    // Компактный блок в стиле "адреса" (одна тонкая рамка).
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

    const systemBox = document.createElement("div");
    systemBox.className = "space-y-4";

    const jurisdictionBox = ui.createPaddedSection();
    const jurGrid = ui.createSectionContent();

    const authorityInfo = document.createElement("div");
    authorityInfo.className = "space-y-2";
    authorityInfo.innerHTML = `<div class="text-xs font-semibold ${
      hasAuthorityWarning ? "text-rose-800" : "text-emerald-800"
    }">${hasAuthorityWarning ? "⚠️" : "✅"} Полномочия: ${escapeText(
      authorityValue
    )}</div>`;
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
        <div class="mt-2 text-slate-700">⏱ СЛА по договору: ${escapeText(contractSla)}</div>
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
        btn.addEventListener("click", () => {
          close();
          open(relatedPoint);
        });
        relatedWrap.appendChild(btn);
      });
    }
    relatedBox.appendChild(relatedWrap);

    const deadlineStr = `${pad2(recommendedDeadline.getDate())}.${pad2(recommendedDeadline.getMonth() + 1)}.${recommendedDeadline.getFullYear()}`;

    const auditBox = ui.createPaddedSection();
    const auditProgress = document.createElement("div");
    auditProgress.className = "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700";
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
        : `Поиск похожих сообщений: совпадений не найдено`;

    const rosreestrSearchAddress = item.address || "—";
    const cadastralNumbers = ownerships
      .map((entry) => entry?.cadastralNumber)
      .filter(Boolean);
    const cadastralListText = cadastralNumbers.length > 0 ? cadastralNumbers.join(", ") : "не определены";
    const objectPassport =
      cadastralNumbers.length > 0
        ? `Паспорт объекта (${cadastralNumbers[0]})`
        : "паспорт объекта не определен";
    const rosreestrRequestDone = cadastralNumbers.length > 0;
    const balanceText =
      uniqueBalanceHolderNames.length > 0
        ? uniqueBalanceHolderNames.join("; ")
        : "не определены";

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
            const number = entry?.contract?.number;
            return {
              dt: mkDateTime(9 + idx),
              mode: "Автоматически",
              text: `Запрос в ЕИС по КН ${kn}: ${number ? `найден контракт №${number}` : "контракт не найден"}`,
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

    const recommendationMode = "Автоматически";
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
        text: `Запрос к ГАР`,
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
        mode: recommendationMode,
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
      const statusIcon =
        step.status === "Успешно" ? "✓" : step.status === "Ошибка" ? "✕" : "…";
      const row = document.createElement("div");
      row.className = "text-xs text-slate-900 hidden";
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
    updateAuditProgressLabel(0, auditRows.length);
    auditBox.appendChild(auditProgress);
    auditBox.appendChild(audit);

    const contextTabsWrap = document.createElement("div");
    contextTabsWrap.className = "rounded-xl border border-slate-200 bg-white overflow-hidden";

    const contextTabsBar = document.createElement("div");
    contextTabsBar.className = "flex flex-wrap items-end gap-1 bg-slate-50 border-b border-slate-200 px-2 pt-2";

    const contextPanels = {
      jurisdiction: jurisdictionBox,
      contract: contractBox,
      related: relatedBox,
      audit: auditBox
    };
    const contextTabButtons = {};

    const makeContextTab = (key, label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rounded-t-lg px-3 py-1.5 text-xs font-medium transition border";
      btn.textContent = label;
      btn.addEventListener("click", () => activateContextTab(key));
      contextTabButtons[key] = btn;
      contextTabsBar.appendChild(btn);
    };

    const activateContextTab = (key) => {
      Object.entries(contextPanels).forEach(([k, panel]) => {
        panel.classList.toggle("hidden", k !== key);
      });
      Object.entries(contextTabButtons).forEach(([k, btn]) => {
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

    makeContextTab("jurisdiction", "Полномочия");
    makeContextTab("contract", "Контрактные обязательства");
    makeContextTab("related", "Похожие сообщения");
    makeContextTab("audit", "Аудит-лог");
    activateContextTab("jurisdiction");

    let auditProgressTimer = null;
    let auditProgressFinished = false;
    const stopAuditProgress = () => {
      if (auditProgressTimer) {
        clearInterval(auditProgressTimer);
        auditProgressTimer = null;
      }
    };
    const startAuditProgress = () => {
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
          onRecommendationReady();
        }
        index += 1;
        updateAuditProgressLabel(index, auditRows.length);
      }, 1000);
    };

    contextTabsWrap.appendChild(contextTabsBar);
    contextTabsWrap.appendChild(jurisdictionBox);
    contextTabsWrap.appendChild(contractBox);
    contextTabsWrap.appendChild(relatedBox);
    contextTabsWrap.appendChild(auditBox);
    systemBox.appendChild(contextTabsWrap);

    // 🎛 ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ (как в docs/modal.md)
    const { actionsBox, onRecommendationReady: revealRecommendationText } = createModalActionsBox({
      ui,
      item,
      relatedPoints,
      currentItemRef: () => currentItem,
      onClose: close,
      useAssignmentFlow,
      useProcurementFlow,
      contractor,
      deadlineStr,
      attachmentLabel,
      category,
      escalationRule,
      statusToDraftLabel,
      status,
      primaryOwnershipForm,
      city,
      escapeText
    });
    onRecommendationReady = revealRecommendationText;

    const rightContent = ui.createSectionStack([systemBox]);
    return { rightContent, actionsBox, summaryBlock, startAuditProgress, stopAuditProgress };
  };

  const open = (item) => {
    currentItem = item;
    console.log("[photo-badge] modal open", { itemId: item?.id, photoGallery: item?.photoGallery });
    const initialPhotoBadgeNodes = ensurePhotoBadge();
    if (initialPhotoBadgeNodes?.badge) {
      initialPhotoBadgeNodes.badge.style.visibility = "hidden";
    }
    title.textContent = item.theme;
    const gar = item.gar || {};
    const addressLine = item.address || "—";
    const coordsLine = gar.coordinate || formatCoords(item.coords);
    const objectTypeLine = gar.objectType || "—";
    const municipalDistrictLine = gar.municipalDistrict || "—";
    address.innerHTML = `
      <div class="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
        <div class="flex items-start justify-between gap-3">
          <div class="text-sm text-slate-700 leading-relaxed">${escapeText(addressLine)}
            <span data-gar-badge class="hidden inline-flex align-middle ml-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">проверено ГАР</span>
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-500">Координаты: ${escapeText(coordsLine)}</div>
        <div class="text-xs text-slate-500">Тип объекта: ${escapeText(objectTypeLine)}</div>
        <div class="text-xs text-slate-500">Муниципальный район: ${escapeText(municipalDistrictLine)}</div>
      </div>
    `;
    const garBadge = address.querySelector("[data-gar-badge]");
    const showGarBadge = () => garBadge?.classList.remove("hidden");
    renderPhotoCarousel(item);

    const showPhotoBadge = () => {
      const nodes = ensurePhotoBadge();
      if (nodes?.badge) nodes.badge.style.visibility = "visible";
    };
    const { rightContent, actionsBox, summaryBlock, startAuditProgress, stopAuditProgress } = buildStructured(item, {
      onGarVerified: showGarBadge,
      onPhotoVerified: showPhotoBadge
    });
    summary.innerHTML = "";
    summary.appendChild(summaryBlock);
    const prevDynamic = rightColumn.querySelector('[data-modal-dynamic="context"]');
    if (prevDynamic) prevDynamic.remove();
    rightContent.setAttribute("data-modal-dynamic", "context");
    rightColumn.insertBefore(rightContent, hint);
    leftActions.innerHTML = "";
    leftActions.appendChild(actionsBox);
    stopAuditProgressRef?.();
    startAuditProgressRef = startAuditProgress;
    stopAuditProgressRef = stopAuditProgress;

    isOpen = true;
    modal.classList.remove("hidden");

    // Чтобы анимация гарантированно проигрывалась при каждом открытии.
    modal.classList.remove("modal-open");
    void modal.offsetWidth;
    requestAnimationFrame(() => modal.classList.add("modal-open"));
    startAuditProgressRef?.();

    document.body.style.overflow = "hidden";
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    currentItem = null;
    summary.innerHTML = "";
    leftActions.innerHTML = "";
    const prevDynamic = rightColumn.querySelector('[data-modal-dynamic="context"]');
    if (prevDynamic) prevDynamic.remove();
    stopAuditProgressRef?.();
    startAuditProgressRef = null;
    stopAuditProgressRef = null;

    modal.classList.remove("modal-open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
  });

  return { open, close };
}

