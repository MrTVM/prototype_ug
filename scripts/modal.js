import { el } from "./utils.js";

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
  // Для генерации HTML не используем: только в отдельных местах (риски минимальны).
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createText(parent, className, text) {
  const node = document.createElement("div");
  if (className) node.className = className;
  node.textContent = text;
  parent.appendChild(node);
  return node;
}

function createRow(parent, label, value) {
  const row = document.createElement("div");
  row.className = "flex items-start justify-between gap-4";

  const l = document.createElement("div");
  l.className = "text-xs text-slate-500 min-w-[45%]";
  l.textContent = label;

  const v = document.createElement("div");
  v.className = "text-xs text-slate-900 text-right flex-1";
  v.textContent = value;

  row.appendChild(l);
  row.appendChild(v);
  parent.appendChild(row);
  return row;
}

function createBulletList(parent, items) {
  const ul = document.createElement("ul");
  ul.className = "space-y-1";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "flex items-start gap-2";

    const dot = document.createElement("span");
    dot.className = "mt-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-slate-300";

    const text = document.createElement("span");
    text.className = "text-xs text-slate-900";
    text.textContent = item;

    li.appendChild(dot);
    li.appendChild(text);
    ul.appendChild(li);
  }

  parent.appendChild(ul);
  return ul;
}

function createBox({ title, children }) {
  const box = document.createElement("div");
  box.className = "rounded-xl border border-slate-200 bg-white/70 shadow-sm overflow-hidden";

  const header = document.createElement("div");
  header.className = "px-4 py-3 border-b border-slate-200/70";

  const h = document.createElement("div");
  h.className = "text-sm font-semibold text-slate-900 flex items-center gap-2";
  h.textContent = title;
  header.appendChild(h);

  box.appendChild(header);
  const content = document.createElement("div");
  content.className = "p-4";
  if (children) content.appendChild(children);
  box.appendChild(content);

  return box;
}

function createSectionStack(blocks) {
  const stack = document.createElement("div");
  stack.className = "space-y-4";
  for (const b of blocks) stack.appendChild(b);
  return stack;
}

function statusToDraftLabel(status) {
  switch (status) {
    case "В работе":
      return "🟡 Черновик (требует согласования)";
    case "На рассмотрении":
      return "🟡 Черновик (требует согласования)";
    case "Завершено":
      return "🟢 Завершено (можно закрывать)";
    case "Приостановлено":
      return "🟠 На паузе (ожидает уточнений)";
    case "Отменено":
      return "🔴 Отменено (закрыто)";
    case "Новый":
      return "🟡 Черновик (требует согласования)";
    default:
      return "🟡 Черновик (требует согласования)";
  }
}

export function createModal() {
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
  let currentPhotos = [];
  let currentPhotoMetas = [];
  let currentPhotoIndex = 0;

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

  const buildStructured = (item) => {
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
      (uniqueOwnershipForms.length === 1 && uniqueOwnershipForms[0] !== "муниципальная");
    const balanceHolderNames = ownerships
      .map((entry) => entry?.balanceHolder?.name?.trim())
      .filter(Boolean);
    const uniqueBalanceHolderNames = [...new Set(balanceHolderNames)];
    const isBalanceHolderDefined =
      uniqueBalanceHolderNames.length > 0 &&
      uniqueBalanceHolderNames.some((name) => !/не определ/i.test(name));
    const contract =
      ownerships.find((entry) => entry?.contract)?.contract || null;
    const complaintNo = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${(parseInt(
      String(item.id || "").replace(/\D/g, "").slice(-4) || "1234",
      10
    ) % 9000) + 1000}`;

    const received = `${pad2(now.getDate())}.${pad2(now.getMonth() + 1)}.${now.getFullYear()} ${pad2(
      now.getHours()
    )}:${pad2(now.getMinutes())}`;

    // Подстановка из данных (прототипные значения, но зависят от переданного item)
    const category = item.requestType || "—";
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

    const jurisdictionBox = document.createElement("div");
    jurisdictionBox.className = "p-3";
    const jurGrid = document.createElement("div");
    jurGrid.className = "mt-3 space-y-3";

    const authorityInfo = document.createElement("div");
    authorityInfo.className = "space-y-2";
    authorityInfo.innerHTML = `<div class="text-xs font-semibold ${
      hasAuthorityWarning ? "text-rose-800" : "text-emerald-800"
    }">${hasAuthorityWarning ? "⚠️" : "✅"} Полномочия: ${escapeText(
      authorityValue
    )}</div>`;
    const authorityItems = document.createElement("div");
    authorityItems.className = "ml-2";
    createBulletList(authorityItems, [
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
    createBulletList(propItems, ownershipLines);
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
    createBulletList(balanceItems, balanceLines);
    balanceInfo.appendChild(balanceItems);

    jurGrid.appendChild(authorityInfo);
    jurGrid.appendChild(propOk);
    jurGrid.appendChild(balanceInfo);

    jurisdictionBox.appendChild(jurGrid);

    const contractBox = document.createElement("div");
    contractBox.className = "p-3";
    const contractItems = document.createElement("div");
    contractItems.className = "mt-3 space-y-3";

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

    const deadlineStr = `${pad2(recommendedDeadline.getDate())}.${pad2(recommendedDeadline.getMonth() + 1)}.${recommendedDeadline.getFullYear()}`;

    const auditBox = document.createElement("div");
    auditBox.className = "p-3";
    const audit = document.createElement("div");
    audit.className = "mt-3 space-y-1";

    const base = new Date(now.getTime());
    const mkTime = (offsetSec) => {
      const t = new Date(base.getTime() + offsetSec * 1000);
      return `${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}`;
    };
    const auditLines = [
      `${mkTime(2)} — Поступление сообщения из ПОС`,
      `${mkTime(3)} — Запрос к ГАР (тестовый контур) → ✓`,
      `${mkTime(4)} — Запрос к Росреестр (мок) → ✓`,
      `${mkTime(5)} — Поиск в реестре контрактов (ЕИС-тест) → ✓`,
      `${mkTime(6)} — Сформированы рекомендации`,
      `${mkTime(7)} — Контекст готов к отображению`
    ];

    for (const line of auditLines) {
      const l = document.createElement("div");
      l.className = "text-xs text-slate-900";
      l.textContent = line;
      audit.appendChild(l);
    }
    auditBox.appendChild(audit);

    const contextTabsWrap = document.createElement("div");
    contextTabsWrap.className = "rounded-xl border border-slate-200 bg-white overflow-hidden";

    const contextTabsBar = document.createElement("div");
    contextTabsBar.className = "flex flex-wrap items-end gap-1 bg-slate-50 border-b border-slate-200 px-2 pt-2";

    const contextPanels = {
      jurisdiction: jurisdictionBox,
      contract: contractBox,
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

    makeContextTab("jurisdiction", "Юрисдикция");
    makeContextTab("contract", "Контрактные обязательства");
    makeContextTab("audit", "Аудит-лог");
    activateContextTab("jurisdiction");

    contextTabsWrap.appendChild(contextTabsBar);
    contextTabsWrap.appendChild(jurisdictionBox);
    contextTabsWrap.appendChild(contractBox);
    contextTabsWrap.appendChild(auditBox);
    systemBox.appendChild(contextTabsWrap);

    // 🎛 ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ (как в docs/modal.md)
    const actionsBox = (() => {
        const wrapper = document.createElement("div");
        wrapper.className = "space-y-3";

        const tabsWrap = document.createElement("div");
        tabsWrap.className = "rounded-xl border border-slate-200 bg-white overflow-hidden";

        const tabsBar = document.createElement("div");
        tabsBar.className = "flex flex-wrap items-end gap-1 bg-slate-50 border-b border-slate-200 px-2 pt-2";

        const panelText = document.createElement("div");
        panelText.className = "p-3";

        panelText.innerHTML = `
          <div class="text-xs font-semibold text-slate-900 mb-2">Текст поручения (по рекомендации)</div>
          <div class="text-xs text-slate-700 whitespace-pre-line">Направить подрядчику ${escapeText(
            contractor
          )} поручение на устранение дефекта.
Адрес: ${escapeText(item.address || "—")}.
Суть: ${escapeText(item.theme || "—")}.
Срок исполнения: до ${escapeText(deadlineStr)} (СЛА: 5 дней).
Основание: п.3.1 Договора №45/25.
Приложения: ${escapeText(attachmentLabel)}.</div>
        `;

        const panelRecommendation = document.createElement("div");
        panelRecommendation.className = "p-3 hidden";
        panelRecommendation.innerHTML = `
          <div class="text-xs font-semibold text-slate-900">✉️ Создать поручение подрядчику ← РЕКОМЕНДУЕТСЯ</div>
          <div class="text-xs text-slate-600 mt-2 whitespace-pre-line">• Исполнитель: ${escapeText(contractor)}
• Срок исполнения: ${escapeText(deadlineStr)} (5 дней)
• Основание: п.3.1 Договора №45/25
• Шаблон: «Уведомление о дефекте с фотофиксацией»
• Статус: ${escapeText(statusToDraftLabel(status))}</div>
        `;

        const panelWhy = document.createElement("div");
        panelWhy.className = "p-3 hidden";
        const whyTitle = document.createElement("div");
        whyTitle.className = "text-xs font-semibold text-slate-900";
        whyTitle.textContent = "🔍 Почему система это предлагает";
        panelWhy.appendChild(whyTitle);
        const whyItems = document.createElement("div");
        whyItems.className = "mt-2";
        createBulletList(whyItems, [
          `Адрес: ${city}`,
          "Тип объекта: дорога местного значения",
          "В ЕИС найден действующий контракт → можно направить требование",
          "СЛА: 5 дней → дедлайн: " + deadlineStr
        ]);
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

        const panels = {
          text: panelText,
          recommendation: panelRecommendation,
          why: panelWhy
        };

        const tabButtons = {};
        const makeTab = (key, label) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className =
            "rounded-t-lg px-3 py-1.5 text-xs font-medium transition border";
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
        activateTab("text");

        tabsWrap.appendChild(tabsBar);
        tabsWrap.appendChild(panelText);
        tabsWrap.appendChild(panelRecommendation);
        tabsWrap.appendChild(panelWhy);

        const row = document.createElement("div");
        row.className = "flex flex-wrap gap-3 items-center";

        const mkBtn = ({ label, className, onClick }) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = className;
          btn.textContent = label;
          btn.addEventListener("click", onClick);
          return btn;
        };

        row.appendChild(
          mkBtn({
            label: "✅ Утвердить поручение",
            className:
              "rounded-xl bg-emerald-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-800 transition",
            onClick: () => {
              if (!currentItem) return;
              window.open(currentItem.source, "_blank", "noreferrer");
              close();
            }
          })
        );

        row.appendChild(
          mkBtn({
            label: "✏️ Редактировать",
            className:
              "rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium shadow-sm transition",
            onClick: () => close()
          })
        );

        row.appendChild(
          mkBtn({
            label: "❌ Отклонить",
            className:
              "rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-sm font-medium text-rose-800 shadow-sm transition",
            onClick: () => close()
          })
        );

        wrapper.appendChild(tabsWrap);
        wrapper.appendChild(row);
        return wrapper;
      })();

    const rightContent = createSectionStack([systemBox]);
    return { rightContent, actionsBox, summaryBlock };
  };

  const open = (item) => {
    currentItem = item;
    console.log("[photo-badge] modal open", { itemId: item?.id, photoGallery: item?.photoGallery });
    ensurePhotoBadge();
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
            <span class="inline-flex align-middle ml-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">проверено ГАР</span>
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-500">Координаты: ${escapeText(coordsLine)}</div>
        <div class="text-xs text-slate-500">Тип объекта: ${escapeText(objectTypeLine)}</div>
        <div class="text-xs text-slate-500">Муниципальный район: ${escapeText(municipalDistrictLine)}</div>
      </div>
    `;
    renderPhotoCarousel(item);

    const { rightContent, actionsBox, summaryBlock } = buildStructured(item);
    summary.innerHTML = "";
    summary.appendChild(summaryBlock);
    const prevDynamic = rightColumn.querySelector('[data-modal-dynamic="context"]');
    if (prevDynamic) prevDynamic.remove();
    rightContent.setAttribute("data-modal-dynamic", "context");
    rightColumn.insertBefore(rightContent, hint);
    leftActions.innerHTML = "";
    leftActions.appendChild(actionsBox);

    isOpen = true;
    modal.classList.remove("hidden");

    // Чтобы анимация гарантированно проигрывалась при каждом открытии.
    modal.classList.remove("modal-open");
    void modal.offsetWidth;
    requestAnimationFrame(() => modal.classList.add("modal-open"));

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

