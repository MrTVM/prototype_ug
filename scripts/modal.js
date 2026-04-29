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
  const photo = el("modal-photo");
  const structured = el("modal-structured");

  if (!modal) throw new Error('Missing element: "modal"');
  if (!structured) throw new Error('Missing element: "modal-structured"');

  let isOpen = false;
  let currentItem = null;

  const buildStructured = (item) => {
    const now = new Date(item.createdAt);
    const city = getCity(item.address);
    const coords = formatCoords(item.coords);
    const gar = item.gar || {};
    const garCoordinate = gar.coordinate || coords;
    const garObjectType = gar.objectType || "—";
    const garMunicipalDistrict = gar.municipalDistrict || "—";
    const ownership = item.ownership || {};
    const cadastralNumber = ownership.cadastralNumber || "—";
    const ownershipForm = ownership.ownershipForm || "—";
    const vri = ownership.vri || "—";
    const balanceHolder = item.balanceHolder || {};
    const balanceHolderName = balanceHolder.name || "Не определён";
    const isBalanceHolderDefined = !/не определ/i.test(balanceHolderName);
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
    const photoName = item.photoSrc
      ? String(item.photoSrc)
          .split("/")
          .pop()
          .split("?")[0]
          .trim()
      : "";
    const attachmentLabel = item.photoSrc ? `🖼️ ${photoName || "фото"}` : "—";
    const status = item.status || "—";

    const recommendedDeadline = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const contractor =
      /дорог|благо|территор|коммун/i.test(String(item.theme || "")) ? "ООО «Асфальт»" : "ООО «Спектр»";

    const templateTable = document.createElement("div");
    templateTable.className = "space-y-3";

    // Блок: “шапка” как в примере docs/modal.md
    const headerGrid = document.createElement("div");
    headerGrid.className = "grid grid-cols-1 sm:grid-cols-3 gap-3 items-start";

    const posCard = document.createElement("div");
    posCard.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    posCard.innerHTML = `<div class="text-xs text-slate-500">ОБРАЩЕНИЕ</div><div class="text-sm font-semibold text-slate-900 mt-1">№${escapeText(
      complaintNo
    )}</div>`;

    const receivedCard = document.createElement("div");
    receivedCard.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    receivedCard.innerHTML = `<div class="text-xs text-slate-500">Поступило</div><div class="text-sm font-semibold text-slate-900 mt-1">${escapeText(
      received
    )}</div>`;

    const cityCard = document.createElement("div");
    cityCard.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    cityCard.innerHTML = `<div class="text-xs text-slate-500">Город</div><div class="text-sm font-semibold text-slate-900 mt-1">${escapeText(
      city
    )}</div>`;

    headerGrid.appendChild(posCard);
    headerGrid.appendChild(receivedCard);
    headerGrid.appendChild(cityCard);

    const applicantCard = document.createElement("div");
    applicantCard.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    applicantCard.innerHTML = `
      <div class="text-xs text-slate-500">Заявитель</div>
      <div class="text-sm font-semibold text-slate-900 mt-1">Иванов И.И. (тел. скрыт)</div>
      <div class="text-xs text-slate-500 mt-2">Категория</div>
      <div class="text-sm font-semibold text-slate-900 mt-1">${escapeText(category)}</div>
    `;

    templateTable.appendChild(headerGrid);
    templateTable.appendChild(applicantCard);

    const textBlock = document.createElement("div");
    textBlock.className = "space-y-2";
    createText(textBlock, "text-sm font-semibold text-slate-900", "📝 ТЕКСТ ОБРАЩЕНИЯ");
    const quote = document.createElement("div");
    quote.className = "rounded-xl border border-slate-200 bg-white/60 p-3 text-sm text-slate-900 whitespace-pre-line";
    quote.textContent = `«${description.trim()}»`;
    textBlock.appendChild(quote);
    const attach = document.createElement("div");
    attach.className = "text-xs text-slate-500";
    attach.textContent = `📎 Вложения: ${attachmentLabel}`;
    textBlock.appendChild(attach);

    const systemBox = document.createElement("div");
    systemBox.className = "space-y-4";

    const sysTitle = document.createElement("div");
    sysTitle.className = "text-sm font-semibold text-slate-900";
    sysTitle.textContent = "🤖 СИСТЕМА УЖЕ ПРОВЕРИЛА КОНТЕКСТ (авто-загрузка)";
    systemBox.appendChild(sysTitle);

    const jurisdictionBox = document.createElement("div");
    jurisdictionBox.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    createText(jurisdictionBox, "text-xs font-semibold text-slate-900", "📍 ЮРИСДИКЦИЯ И АДРЕС");
    const jurGrid = document.createElement("div");
    jurGrid.className = "mt-3 space-y-3";

    const addressOk = document.createElement("div");
    addressOk.className = "space-y-2";
    addressOk.innerHTML = `<div class="text-xs font-semibold text-emerald-800">✅ Адрес валидирован</div>`;
    const addrItems = document.createElement("div");
    addrItems.className = "ml-2";
    createBulletList(addrItems, [
      `Координаты: ${garCoordinate}`,
      `Тип объекта: ${garObjectType}`,
      `Муниципальный район: ${garMunicipalDistrict}`
    ]);
    addressOk.appendChild(addrItems);

    const propOk = document.createElement("div");
    propOk.className = "space-y-2";
    propOk.innerHTML = `<div class="text-xs font-semibold text-emerald-800">✅ Собственность</div>`;
    const propItems = document.createElement("div");
    propItems.className = "ml-2";
    createBulletList(propItems, [
      `Кадастровый номер: ${cadastralNumber}`,
      `Форма собственности: ${ownershipForm}`,
      `ВРИ: ${vri}`
    ]);
    propOk.appendChild(propItems);

    const balanceInfo = document.createElement("div");
    balanceInfo.className = "space-y-2";
    balanceInfo.innerHTML = `<div class="text-xs font-semibold ${
      isBalanceHolderDefined ? "text-emerald-800" : "text-rose-800"
    }">${isBalanceHolderDefined ? "✅" : "⚠️"} Балансодержатель: ${escapeText(balanceHolderName)}</div>`;
    const balanceItems = document.createElement("div");
    balanceItems.className = "ml-2";
    createBulletList(balanceItems, [
      isBalanceHolderDefined
        ? "Данные получены из реестра балансодержателей"
        : "Требует уточнения в реестре имущества"
    ]);
    balanceInfo.appendChild(balanceItems);

    jurGrid.appendChild(addressOk);
    jurGrid.appendChild(propOk);
    jurGrid.appendChild(balanceInfo);

    jurisdictionBox.appendChild(jurGrid);

    const contractBox = document.createElement("div");
    contractBox.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
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

    const recommendedBox = document.createElement("div");
    recommendedBox.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    createText(recommendedBox, "text-xs font-semibold text-slate-900", "🎯 РЕКОМЕНДУЕМЫЕ ДЕЙСТВИЯ (предзаполнены)");

    const deadlineStr = `${pad2(recommendedDeadline.getDate())}.${pad2(recommendedDeadline.getMonth() + 1)}.${recommendedDeadline.getFullYear()}`;

    const actionsList = document.createElement("div");
    actionsList.className = "mt-3 space-y-2";

    const recommendedItem = (label, sub) => {
      const row = document.createElement("div");
      row.className = "rounded-xl border border-slate-200 bg-white/70 px-3 py-2";
      const top = document.createElement("div");
      top.className = "text-xs font-semibold text-slate-900";
      top.textContent = label;
      const s = document.createElement("div");
      s.className = "text-xs text-slate-600 mt-1 whitespace-pre-line";
      s.textContent = sub;
      row.appendChild(top);
      row.appendChild(s);
      return row;
    };

    actionsList.appendChild(
      recommendedItem("✉️ Создать поручение подрядчику ← РЕКОМЕНДУЕТСЯ", `• Исполнитель: ${contractor}
• Срок исполнения: ${deadlineStr} (5 дней)
• Основание: п.3.1 Договора №45/25
• Шаблон: «Уведомление о дефекте с фотофиксацией»
• Статус: ${statusToDraftLabel(status)}`)
    );
    actionsList.appendChild(recommendedItem("📊 Добавить в дашборд контроля качества", " " ));
    actionsList.appendChild(recommendedItem("⚠️ Эскалировать", "— не применимо (юрисдикция ОМСУ)"));

    recommendedBox.appendChild(actionsList);

    const whyBox = document.createElement("div");
    whyBox.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
    createText(whyBox, "text-xs font-semibold text-slate-900", "🔍 ПОЧЕМУ СИСТЕМА ЭТО ПРЕДЛАГАЕТ?");
    const whyItems = document.createElement("div");
    whyItems.className = "mt-3";
    createBulletList(whyItems, [
      `Адрес: ${city}`,
      "Тип объекта: дорога местного значения",
      "В ЕИС найден действующий контракт → можно направить требование",
      "СЛА: 5 дней → дедлайн: " + deadlineStr
    ]);
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

    whyBox.appendChild(whyItems);
    whyBox.appendChild(whyLinks);

    const auditBox = document.createElement("div");
    auditBox.className = "rounded-xl border border-slate-200 bg-white/60 p-3";
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

    systemBox.appendChild(jurisdictionBox);
    systemBox.appendChild(contractBox);
    systemBox.appendChild(recommendedBox);
    systemBox.appendChild(whyBox);
    systemBox.appendChild(auditBox);

    // 🎛 ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ (как в docs/modal.md)
    const actionsBox = createBox({
      title: "🎛 ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ",
      children: (() => {
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

        return row;
      })()
    });

    systemBox.appendChild(actionsBox);

    return createSectionStack([templateTable, textBlock, systemBox]);
  };

  const open = (item) => {
    currentItem = item;
    title.textContent = item.theme;
    address.textContent = item.address;
    photo.src = item.photoSrc;

    structured.innerHTML = "";
    structured.appendChild(buildStructured(item));

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

