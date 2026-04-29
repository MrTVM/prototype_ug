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
  let currentPhotoIndex = 0;

  const renderPhotoCarousel = (item) => {
    const seedBase = String(item.id || "fallback");
    const fallbackGallery = [
      `https://picsum.photos/seed/${seedBase}-1/1200/800`,
      `https://picsum.photos/seed/${seedBase}-2/1200/800`,
      `https://picsum.photos/seed/${seedBase}-3/1200/800`
    ];

    const sourceGallery = Array.isArray(item.photoGallery)
      ? item.photoGallery
      : item.photoSrc
        ? [item.photoSrc]
        : [];

    currentPhotos = sourceGallery.filter(Boolean);
    if (currentPhotos.length === 0) {
      currentPhotos = fallbackGallery;
    } else if (currentPhotos.length === 1) {
      // Даже при одном фото оставляем возможность листания на fallback-кадры.
      currentPhotos = [currentPhotos[0], fallbackGallery[1], fallbackGallery[2]];
    }

    currentPhotoIndex = 0;

    const applyMain = () => {
      photoMain.src = currentPhotos[currentPhotoIndex];
      photoMain.alt = `Фото ${currentPhotoIndex + 1}`;
      photoMain.onerror = () => {
        photoMain.onerror = null;
        photoMain.src = fallbackGallery[currentPhotoIndex % fallbackGallery.length];
      };
      photoPrev.classList.toggle("hidden", currentPhotos.length <= 1);
      photoNext.classList.toggle("hidden", currentPhotos.length <= 1);
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
    const ownershipForms = ownerships
      .map((entry) => entry?.ownershipForm)
      .filter(Boolean)
      .join(" ");
    const authoritySource = `${item.authority || ""} ${ownershipForms}`.toLowerCase();
    const authorityValue = authoritySource.includes("част")
      ? "частный"
      : authoritySource.includes("муницип")
        ? "муниципальный"
        : authoritySource.includes("регион")
          ? "региональный"
          : "федеральный";
    const balanceHolderNames = ownerships
      .map((entry) => entry?.balanceHolder?.name?.trim())
      .filter(Boolean);
    const uniqueBalanceHolderNames = [...new Set(balanceHolderNames)];
    const isBalanceHolderDefined =
      uniqueBalanceHolderNames.length > 0 &&
      uniqueBalanceHolderNames.some((name) => !/не определ/i.test(name));
    const complaintNo = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${(parseInt(
      String(item.id || "").replace(/\D/g, "").slice(-4) || "1234",
      10
    ) % 9000) + 1000}`;

    const received = `${pad2(now.getDate())}.${pad2(now.getMonth() + 1)}.${now.getFullYear()} ${pad2(
      now.getHours()
    )}:${pad2(now.getMinutes())}`;

    // Подстановка из данных (прототипные значения, но зависят от переданного item)
    const category = item.requestType || "—";
    const description = item.description || "";
    const primaryPhoto = Array.isArray(item.photoGallery) && item.photoGallery.length > 0 ? item.photoGallery[0] : item.photoSrc;
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
        <div class="text-xs text-slate-500">ОБРАЩЕНИЕ</div>
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
          <span class="font-semibold text-slate-900">Иванов И.И. (тел. скрыт)</span>
        </span>
        <span>
          <span class="text-xs text-slate-500">Категория:</span>
          <span class="font-semibold text-slate-900">${escapeText(category)}</span>
        </span>
      </div>
    `;

    const textInfo = document.createElement("div");
    textInfo.className = "pt-2 border-t border-slate-200/70 space-y-2";
    textInfo.innerHTML = `<div class="text-sm font-semibold text-slate-900">📝 ТЕКСТ ОБРАЩЕНИЯ</div>`;
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
    createText(jurisdictionBox, "text-xs font-semibold text-slate-900", "📍 ЮРИСДИКЦИЯ");
    const jurGrid = document.createElement("div");
    jurGrid.className = "mt-3 space-y-3";

    const authorityInfo = document.createElement("div");
    authorityInfo.className = "space-y-2";
    authorityInfo.innerHTML = `<div class="text-xs font-semibold text-emerald-800">✅ Полномочия: ${escapeText(
      authorityValue
    )}</div>`;
    const authorityItems = document.createElement("div");
    authorityItems.className = "ml-2";
    createBulletList(authorityItems, ["Класс полномочий определён автоматически"]);
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
    createText(contractBox, "text-xs font-semibold text-slate-900", "📋 КОНТРАКТНЫЕ ОБЯЗАТЕЛЬСТВА");
    const contractItems = document.createElement("div");
    contractItems.className = "mt-3 space-y-3";

    const found = document.createElement("div");
    found.className = "text-xs font-semibold text-emerald-900";
    found.textContent = "✅ Найдено совпадение в реестре контрактов [ЕИС 🔵 Тест]";
    contractItems.appendChild(found);

    const contractDetails = document.createElement("div");
    contractDetails.className = "ml-1 space-y-1 text-xs text-slate-900";
    contractDetails.innerHTML = `
      <div>📄 Договор № 45/25 от 12.03.2025</div>
      <div class="text-slate-600 ml-4">• Предмет: Содержание дорог местного значения</div>
      <div class="text-slate-600 ml-4">• Подрядчик: ${escapeText(contractor)} (ИНН 7701234567) 🏢</div>
      <div class="text-slate-600 ml-4">• Контакт: petrov@asphalt.ru | +7 (495) 123-45-67</div>
      <div class="text-slate-600 ml-4">• Сумма: 12,5 млн руб. | Окончание: 31.12.2026</div>
      <div class="mt-2 text-slate-700">⏱ СЛА по договору: 5 дней с момента фиксации</div>
      <div class="text-slate-700">💰 Штрафные санкции: 0.1% от цены этапа / день</div>
      <div class="mt-2 font-semibold text-slate-900">🟢 Статус: ${escapeText(status)}</div>
    `;
    contractItems.appendChild(contractDetails);
    contractBox.appendChild(contractItems);

    const deadlineStr = `${pad2(recommendedDeadline.getDate())}.${pad2(recommendedDeadline.getMonth() + 1)}.${recommendedDeadline.getFullYear()}`;

    const auditBox = document.createElement("div");
    auditBox.className = "p-3";
    createText(auditBox, "text-xs font-semibold text-slate-900", "🗂 АУДИТ-ЛОГ (автоматически)");
    const audit = document.createElement("div");
    audit.className = "mt-3 space-y-1";

    const base = new Date(now.getTime());
    const mkTime = (offsetSec) => {
      const t = new Date(base.getTime() + offsetSec * 1000);
      return `${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}`;
    };
    const auditLines = [
      `${mkTime(2)} — Поступление обращения из ПОС`,
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

