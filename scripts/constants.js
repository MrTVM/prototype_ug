export const points = [
  {
    id: "p1",
    requestType: "ЖКХ / Коммунальные сети",
    createdAt: "2026-04-29 09:15",
    plannedCloseAt: "2026-05-04 18:00",
    gar: {
      objectType: "Инженерные коммуникации",
      coordinate: "55.751244, 37.618423",
      municipalDistrict: "Центральный"
    },
    ownerships: [
      {
        cadastralNumber: "77:01:0001001:45",
        ownershipForm: "муниципальная",
        vri: "Для размещения инженерной инфраструктуры",
        balanceHolder: {
          name: "ГБУ «Мосводоканалсеть»"
        }
      }
    ],
    theme: "Ремонт коммуникаций",
    address: "Москва, ул. Примерная, 1",
    status: "В работе",
    description:
      "Планируется замена участка трубопровода.\nСроки уточняются после выезда специалиста.",
    photoGallery: [
      {
        source: "https://picsum.photos/seed/p1-1/1200/800",
        meta: {
          createdAt: "2026-04-28 08:50",
          updatedAt: "2026-04-28 09:05",
          coordinates: "55.751244, 37.618423"
        }
      },
      {
        source: "https://picsum.photos/seed/p1-2/1200/800",
        meta: {
          createdAt: "2026-04-29 08:52",
          updatedAt: "2026-04-29 09:06",
          coordinates: "55.751244, 37.618423"
        }
      },
      {
        source: "https://picsum.photos/seed/p1-3/1200/800",
        meta: {
          createdAt: "2026-04-29 08:55",
          updatedAt: "2026-04-29 09:10",
          coordinates: "55.751244, 37.618423"
        }
      }
    ],
    source: "https://example.com/complaint/p1",
    coords: [55.751244, 37.618423]
  },
  {
    id: "p2",
    requestType: "Дороги / Ямочный ремонт",
    createdAt: "2026-04-29 10:05",
    plannedCloseAt: "2026-05-05 17:30",
    gar: {
      objectType: "Дорога местного значения",
      coordinate: "55.7608, 37.606",
      municipalDistrict: "Тверской"
    },
    ownerships: [
      {
        cadastralNumber: "77:01:0002002:17",
        ownershipForm: "муниципальная",
        vri: "Для размещения автомобильных дорог",
        contract: {
          number: "45/25",
          date: "12.03.2025",
          subject: "Содержание дорог местного значения",
          contractor: "ООО «Асфальт»",
          contractorInn: "7701234567",
          contact: "petrov@asphalt.ru | +7 (495) 123-45-67",
          amount: "12,5 млн руб.",
          endDate: "31.12.2026",
          sla: "5 дней с момента фиксации",
          penalty: "0.1% от цены этапа / день"
        },
        balanceHolder: {
          name: "ГБУ «Автомобильные дороги ЦАО»"
        }
      }
    ],
    theme: "Восстановление дорожного полотна",
    address: "Москва, пр-т Тестовый, 17",
    status: "На рассмотрении",
    description:
      "Заявка направлена в профильный отдел.\nОжидаем подтверждение графика работ.",
    photoGallery: [
      {
        source: "https://picsum.photos/seed/p2-1/1200/800",
        meta: {
          createdAt: "2026-04-29 09:50",
          updatedAt: "2026-04-29 10:00",
          coordinates: "55.7608, 37.606"
        }
      }
    ],
    source: "https://example.com/complaint/p2",
    coords: [55.7608, 37.606]
  },
  {
    id: "p3",
    requestType: "Электроснабжение / Авария",
    createdAt: "2026-04-28 21:40",
    plannedCloseAt: "2026-04-29 14:00",
    gar: {
      objectType: "Объект электросетевого хозяйства",
      coordinate: "55.739, 37.617",
      municipalDistrict: "Якиманка"
    },
    ownerships: [
      {
        cadastralNumber: "77:01:0003003:9",
        ownershipForm: "федеральная",
        vri: "Для размещения объектов энергоснабжения",
        balanceHolder: {
          name: "ПАО «Мосэнергосеть»"
        }
      },
      {
        cadastralNumber: "77:01:0003003:10",
        ownershipForm: "муниципальная",
        vri: "Для размещения инженерной инфраструктуры",
        balanceHolder: {
          name: "ПАО «Мосэнергосеть»"
        }
      },
      {
        cadastralNumber: "77:01:0003003:11",
        ownershipForm: "частная",
        vri: "Для эксплуатации трансформаторного пункта",
        balanceHolder: {
          name: "ПАО «Мосэнергосеть»"
        }
      }
    ],
    theme: "Устранение аварии электроснабжения",
    address: "Москва, ул. Сервисная, 9",
    status: "Завершено",
    description:
      "Неисправность устранена.\nПроведены проверки и включение нагрузки в штатный режим.",
    photoGallery: [
      {
        source: "https://picsum.photos/seed/p3-1/1200/800",
        meta: {
          createdAt: "2026-04-27 21:15",
          updatedAt: "2026-04-27 21:30",
          coordinates: "55.739, 37.617"
        }
      },
      {
        source: "https://picsum.photos/seed/p3-2/1200/800",
        meta: {
          createdAt: "2026-04-27 21:20",
          updatedAt: "2026-04-27 21:35",
          coordinates: "55.739, 37.617"
        }
      }
    ],
    source: "https://example.com/complaint/p3",
    coords: [55.739, 37.617]
  },
  {
    id: "p4",
    requestType: "Благоустройство / Уборка",
    createdAt: "2026-04-29 08:20",
    plannedCloseAt: "2026-05-03 16:00",
    gar: {
      objectType: "Общественная территория",
      coordinate: "55.7632, 37.5647",
      municipalDistrict: "Пресненский"
    },
    ownerships: [],
    theme: "Очистка и благоустройство территории",
    address: "Москва, наб. Прототипная, 3",
    status: "Новый",
    description:
      "Требуется вывоз мусора и первичная уборка.\nПосле согласования подготовим график выездов.",
    photoGallery: [
      {
        source: "https://picsum.photos/seed/p4-1/1200/800",
        meta: {
          createdAt: "2026-04-29 08:00",
          updatedAt: "2026-04-29 08:10",
          coordinates: "55.7632, 37.5647"
        }
      },
      {
        source: "https://picsum.photos/seed/p4-2/1200/800",
        meta: {
          createdAt: "2026-04-29 08:05",
          updatedAt: "2026-04-29 08:15",
          coordinates: "55.7632, 37.5647"
        }
      },
      {
        source: "https://picsum.photos/seed/p4-3/1200/800",
        meta: {
          createdAt: "2026-04-29 08:08",
          updatedAt: "2026-04-29 08:18",
          coordinates: "55.7632, 37.5647"
        }
      }
    ],
    source: "https://example.com/complaint/p4",
    coords: [55.7632, 37.5647]
  },
  {
    id: "p5",
    requestType: "Согласования / Приостановка работ",
    createdAt: "2026-04-27 13:50",
    plannedCloseAt: "2026-05-10 12:00",
    gar: {
      objectType: "Улично-дорожная сеть",
      coordinate: "55.7492, 37.655",
      municipalDistrict: "Басманный"
    },
    ownerships: [
      {
        cadastralNumber: "77:01:0005005:22",
        ownershipForm: "муниципальная",
        vri: "Для размещения улично-дорожной сети",
        balanceHolder: {
          name: "ГБУ «Автодорсервис Басманный»"
        }
      }
    ],
    theme: "Приостановка работ по согласованию",
    address: "Москва, ул. Адаптерная, 22",
    status: "Приостановлено",
    description:
      "Работы приостановлены до получения дополнительных согласований.\nПланируем возобновление после решения вопроса.",
    photoGallery: [
      {
        source: "https://picsum.photos/seed/p5-1/1200/800",
        meta: {
          createdAt: "2026-04-27 13:20",
          updatedAt: "2026-04-27 13:35",
          coordinates: "55.7492, 37.655"
        }
      },
      {
        source: "https://picsum.photos/seed/p5-2/1200/800",
        meta: {
          createdAt: "2026-04-27 13:25",
          updatedAt: "2026-04-27 13:40",
          coordinates: "55.7492, 37.655"
        }
      }
    ],
    source: "https://example.com/complaint/p5",
    coords: [55.7492, 37.655]
  },
  {
    id: "p6",
    requestType: "Контроль качества / Отмена",
    createdAt: "2026-04-26 11:10",
    plannedCloseAt: "2026-04-26 12:00",
    gar: {
      objectType: "Городская территория",
      coordinate: "55.706, 37.61",
      municipalDistrict: "Донской"
    },
    ownerships: [
      {
        cadastralNumber: "77:01:0006006:5",
        ownershipForm: "региональная",
        vri: "Требует уточнения",
        balanceHolder: {
          name: "Не определён"
        }
      },
      {
        cadastralNumber: "77:01:0006006:6",
        ownershipForm: "муниципальная",
        vri: "Для обслуживания городской территории",
        balanceHolder: {
          name: "Не определён"
        }
      }
    ],
    theme: "Отмена заявки по причине несоответствия",
    address: "Москва, ул. Несовпадений, 5",
    status: "Отменено",
    description:
      "Заявка отклонена.\nПричина: несоответствие требованиям по регламенту.",
    photoGallery: [
      {
        source: "https://picsum.photos/seed/p6-1/1200/800",
        meta: {
          createdAt: "2026-04-26 10:45",
          updatedAt: "2026-04-26 10:55",
          coordinates: "55.706, 37.61"
        }
      },
      {
        source: "https://picsum.photos/seed/p6-2/1200/800",
        meta: {
          createdAt: "2026-04-26 10:50",
          updatedAt: "2026-04-26 11:00",
          coordinates: "55.706, 37.61"
        }
      }
    ],
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

