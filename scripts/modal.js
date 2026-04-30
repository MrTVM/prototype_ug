import { el, escapeHtml, indexById } from "./utils.js";
import { OWNERSHIP_FORMS, POINT_STATUSES, points, rules, statusToBadge } from "./constants.js";
import { createUiFactory } from "./uiFactory.js";
import { createModalActionsBox } from "./modalActions.js";
import { createModalAuditSection } from "./modalAudit.js";
import { createModalContextTabs } from "./modalContextTabs.js";
import { createModalSections } from "./modalSections.js";
import { createModalSummary } from "./modalSummary.js";

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
  const label = `ЗАГЛУШКА #${index + 1}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <rect x="80" y="80" width="1040" height="640" rx="20" fill="none" stroke="#ef4444" stroke-width="8" stroke-dasharray="16 10"/>
  <text x="600" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#fecaca">${label}</text>
  <text x="600" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#fca5a5">Файл отсутствует или недоступен</text>
  <text x="600" y="485" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#fda4af">seed: ${seed}</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizePhotoSource(source, seed, index) {
  const src = String(source || "").trim();
  if (!src) return createInlineFallbackImage(seed, index);
  if (/^\.?\/?src\//i.test(src)) {
    try {
      return new URL(src.replace(/^\.\//, ""), window.location.href).href;
    } catch (_err) {
      return src;
    }
  }
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

export function createModal({ statusMachine = {}, onStatusChanged = () => {} } = {}) {
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
  let currentAfterPhotos = [];
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
    const sourceAfterGallery = Array.isArray(item.photoAfterGallery)
      ? item.photoAfterGallery
      : item.photoAfterSrc
        ? [{ source: item.photoAfterSrc, meta: {} }]
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
    }
    currentPhotos = photoEntries.map((photo) => photo.source);
    currentAfterPhotos = sourceAfterGallery
      .map((photo, idx) => {
        const normalized = typeof photo === "string" ? { source: photo, meta: {} } : photo;
        return normalizePhotoSource(normalized?.source, `${seedBase}-after`, idx);
      })
      .filter(Boolean);
    currentPhotoMetas = photoEntries.map((photo) => photo.meta || {});

    currentPhotoIndex = 0;
    const photoHost = photoMain?.parentElement;

    const ensureCompareCurtain = () => {
      if (!photoHost) return null;
      let compareRoot = el("modal-photo-compare");
      if (!compareRoot) {
        compareRoot = document.createElement("div");
        compareRoot.id = "modal-photo-compare";
        compareRoot.className = "hidden absolute inset-0 z-20 pointer-events-none";
        compareRoot.innerHTML = `
          <div class="absolute inset-0 pointer-events-none">
            <img id="modal-photo-after-img" alt="Фото после" class="w-full h-full object-cover" src="" />
          </div>
          <div class="absolute left-3 bottom-3 inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700">До</div>
          <div class="absolute right-3 bottom-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/95 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">После</div>
          <div id="modal-photo-divider" class="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.2)]"></div>
          <input
            id="modal-photo-compare-range"
            type="range"
            min="0"
            max="100"
            value="50"
            class="absolute left-1/2 -translate-x-1/2 bottom-3 w-[70%] accent-slate-700 pointer-events-auto"
            aria-label="Сравнение фото до и после"
          />
        `;
        photoHost.appendChild(compareRoot);
      }
      return {
        compareRoot,
        afterImg: el("modal-photo-after-img"),
        divider: el("modal-photo-divider"),
        range: el("modal-photo-compare-range")
      };
    };

    const updateCompareCurtain = () => {
      const nodes = ensureCompareCurtain();
      if (!nodes?.compareRoot || !nodes.afterImg || !nodes.divider || !nodes.range) return;
      const hasAfterPhotos =
        (item.status === POINT_STATUSES.UNDER_REVIEW || item.status === POINT_STATUSES.COMPLETED) &&
        currentAfterPhotos.length > 0;
      if (!hasAfterPhotos) {
        nodes.compareRoot.classList.add("hidden");
        return;
      }
      const afterSrc = currentAfterPhotos[currentPhotoIndex % currentAfterPhotos.length];
      nodes.afterImg.src = afterSrc;
      nodes.afterImg.onerror = () => {
        nodes.afterImg.onerror = null;
        nodes.afterImg.src = createInlineFallbackImage(`${seedBase}-after`, currentPhotoIndex);
      };
      nodes.compareRoot.classList.remove("hidden");

      const applySlider = () => {
        const value = Number(nodes.range.value || 50);
        nodes.afterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
        nodes.divider.style.left = `${value}%`;
      };
      if (!nodes.range.dataset.bound) {
        nodes.range.addEventListener("input", applySlider);
        nodes.range.dataset.bound = "true";
      }
      applySlider();
    };

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
      updateCompareCurtain();
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
      contract?.contractor ||
      (/дорог|благо|территор|коммун/i.test(String(item.theme || "")) ? "ООО «Асфальт»" : "ООО «Спектр»");

    const summaryBlock = createModalSummary({
      item,
      complaintNo,
      received,
      applicantFio,
      applicantPhoneMasked,
      category,
      description,
      attachmentLabel,
      escapeText
    });

    const systemBox = document.createElement("div");
    systemBox.className = "space-y-4";

    const { jurisdictionBox, contractBox, relatedBox, relatedPoints } = createModalSections({
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
      onOpenRelatedPoint: (relatedPoint) => {
        close();
        open(relatedPoint);
      }
    });

    const deadlineStr = `${pad2(recommendedDeadline.getDate())}.${pad2(recommendedDeadline.getMonth() + 1)}.${recommendedDeadline.getFullYear()}`;

    let activateContextTab = () => {};
    const { auditBox, startAuditProgress, stopAuditProgress } = createModalAuditSection({
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
      activateContextTab: (key) => activateContextTab(key),
      getOnRecommendationReady: () => onRecommendationReady
    });

    const contextPanels = {
      jurisdiction: jurisdictionBox,
      contract: contractBox,
      related: relatedBox,
      audit: auditBox
    };
    const contextTabs = createModalContextTabs({
      panels: contextPanels,
      tabs: [
        { key: "jurisdiction", label: "Полномочия" },
        { key: "contract", label: "Контрактные обязательства" },
        { key: "related", label: "Похожие сообщения" },
        { key: "audit", label: "Аудит-лог" }
      ],
      initialTab: "jurisdiction"
    });
    activateContextTab = contextTabs.activateTab;
    const contextTabsWrap = contextTabs.wrap;
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
      getAllowedTransitions: statusMachine.getAllowedTransitions,
      onTransitionRequest: (nextStatus) => {
        const transitionFn = statusMachine.transitionPointStatus;
        if (typeof transitionFn !== "function") return;
        const result = transitionFn(item, nextStatus);
        if (result?.changed) onStatusChanged(item);
      }
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

