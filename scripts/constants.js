export const points = [
  {
    id: "p1",
    requestType: "ЖКХ / Коммунальные сети",
    createdAt: "2026-04-29 09:15",
    plannedCloseAt: "2026-05-04 18:00",
    theme: "Ремонт коммуникаций",
    address: "Москва, ул. Примерная, 1",
    status: "В работе",
    description:
      "Планируется замена участка трубопровода.\nСроки уточняются после выезда специалиста.",
    photoSrc:
      "https://placehold.co/1200x800/png?text=%D0%A4%D0%BE%D1%82%D0%BE%3A+%D0%A0%D0%B5%D0%BC%D0%BE%D0%BD%D1%82+%D0%BA%D0%BE%D0%BC%D0%BC%D1%83%D0%BD%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B9",
    source: "https://example.com/complaint/p1",
    coords: [55.751244, 37.618423]
  },
  {
    id: "p2",
    requestType: "Дороги / Ямочный ремонт",
    createdAt: "2026-04-29 10:05",
    plannedCloseAt: "2026-05-05 17:30",
    theme: "Восстановление дорожного полотна",
    address: "Москва, пр-т Тестовый, 17",
    status: "На рассмотрении",
    description:
      "Заявка направлена в профильный отдел.\nОжидаем подтверждение графика работ.",
    photoSrc:
      "https://placehold.co/1200x800/png?text=%D0%A4%D0%BE%D1%82%D0%BE%3A+%D0%94%D0%BE%D1%80%D0%BE%D0%B6%D0%BD%D0%BE%D0%B5+%D0%BF%D0%BE%D0%BB%D0%BE%D1%82%D0%BD%D0%BE",
    source: "https://example.com/complaint/p2",
    coords: [55.7608, 37.606]
  },
  {
    id: "p3",
    requestType: "Электроснабжение / Авария",
    createdAt: "2026-04-28 21:40",
    plannedCloseAt: "2026-04-29 14:00",
    theme: "Устранение аварии электроснабжения",
    address: "Москва, ул. Сервисная, 9",
    status: "Завершено",
    description:
      "Неисправность устранена.\nПроведены проверки и включение нагрузки в штатный режим.",
    photoSrc:
      "https://placehold.co/1200x800/png?text=%D0%A4%D0%BE%D1%82%D0%BE%3A+%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5",
    source: "https://example.com/complaint/p3",
    coords: [55.739, 37.617]
  },
  {
    id: "p4",
    requestType: "Благоустройство / Уборка",
    createdAt: "2026-04-29 08:20",
    plannedCloseAt: "2026-05-03 16:00",
    theme: "Очистка и благоустройство территории",
    address: "Москва, наб. Прототипная, 3",
    status: "Новый",
    description:
      "Требуется вывоз мусора и первичная уборка.\nПосле согласования подготовим график выездов.",
    photoSrc:
      "https://placehold.co/1200x800/png?text=%D0%A4%D0%BE%D1%82%D0%BE%3A+%D0%91%D0%BB%D0%B0%D0%B3%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE",
    source: "https://example.com/complaint/p4",
    coords: [55.7632, 37.5647]
  },
  {
    id: "p5",
    requestType: "Согласования / Приостановка работ",
    createdAt: "2026-04-27 13:50",
    plannedCloseAt: "2026-05-10 12:00",
    theme: "Приостановка работ по согласованию",
    address: "Москва, ул. Адаптерная, 22",
    status: "Приостановлено",
    description:
      "Работы приостановлены до получения дополнительных согласований.\nПланируем возобновление после решения вопроса.",
    photoSrc:
      "https://placehold.co/1200x800/png?text=%D0%A4%D0%BE%D1%82%D0%BE%3A+%D0%9F%D1%80%D0%B8%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%BE",
    source: "https://example.com/complaint/p5",
    coords: [55.7492, 37.655]
  },
  {
    id: "p6",
    requestType: "Контроль качества / Отмена",
    createdAt: "2026-04-26 11:10",
    plannedCloseAt: "2026-04-26 12:00",
    theme: "Отмена заявки по причине несоответствия",
    address: "Москва, ул. Несовпадений, 5",
    status: "Отменено",
    description:
      "Заявка отклонена.\nПричина: несоответствие требованиям по регламенту.",
    photoSrc:
      "https://placehold.co/1200x800/png?text=%D0%A4%D0%BE%D1%82%D0%BE%3A+%D0%9E%D1%82%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%BE",
    source: "https://example.com/complaint/p6",
    coords: [55.706, 37.61]
  }
];

const statusToBadgeMap = {
  "Новый": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  "В работе": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "На рассмотрении": { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" },
  "Завершено": { bg: "bg-slate-50", text: "text-slate-800", border: "border-slate-200" },
  "Приостановлено": { bg: "bg-orange-50", text: "text-orange-900", border: "border-orange-200" },
  "Отменено": { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" }
};

export const statusToBadge = (status) =>
  statusToBadgeMap[status] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200"
  };

export const statusToColorMap = {
  "Новый": "#10b981",
  "В работе": "#2563eb",
  "На рассмотрении": "#f59e0b",
  "Завершено": "#334155",
  "Приостановлено": "#f97316",
  "Отменено": "#e11d48"
};

export const statusToColor = (status) => statusToColorMap[status] || "#64748b";

// Вынесено как константа, чтобы карта/рендер были независимыми.
export const YANDEX_MAPS_API_KEY = "6e36b74d-2152-4260-9127-6492ff601208";

export const MAP_CENTER_FALLBACK = points[0]?.coords || [55.751244, 37.618423];

