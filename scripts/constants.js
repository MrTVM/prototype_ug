export const REQUEST_TYPES = Object.freeze({
  ROADS_PATCH_REPAIR: "Дороги / Ямочный ремонт",
  HOUSING_UTILITIES_NETWORKS: "ЖКХ / Коммунальные сети",
  POWER_SUPPLY_EMERGENCY: "Электроснабжение / Авария",
  IMPROVEMENT_CLEANING: "Благоустройство / Уборка",
  APPROVALS_WORK_SUSPENSION: "Согласования / Приостановка работ",
  QUALITY_CONTROL_CANCELLATION: "Контроль качества / Отмена"
});

export const POINT_STATUSES = Object.freeze({
  NEW: "Новый",
  IN_PROGRESS: "В работе",
  UNDER_REVIEW: "На рассмотрении",
  COMPLETED: "Завершено",
  SUSPENDED: "Приостановлено",
  CANCELED: "Отменено"
});

export const STATUS_ORDER = Object.freeze([
  POINT_STATUSES.NEW,
  POINT_STATUSES.IN_PROGRESS,
  POINT_STATUSES.UNDER_REVIEW,
  POINT_STATUSES.COMPLETED,
  POINT_STATUSES.SUSPENDED,
  POINT_STATUSES.CANCELED
]);

export const POINT_SOURCES = Object.freeze({
  POS: "ПОС",
  SERVICE_112: "112",
  EDDS: "ЕДДС",
  OFFLINE: "Офлайн",
  EMAIL: "Email"
});

export const OWNERSHIP_FORMS = Object.freeze({
  FEDERAL: "федеральная",
  REGIONAL: "региональная",
  MUNICIPAL: "муниципальная",
  PRIVATE: "частная"
});

const applicantsById = {
  "u-1001": { id: "u-1001", fio: "Иванов Иван Иванович", phone: "+7 (901) 111-22-33" },
  "u-1002": { id: "u-1002", fio: "Петров Пётр Петрович", phone: "+7 (902) 222-33-44" },
  "u-1003": { id: "u-1003", fio: "Сидорова Анна Сергеевна", phone: "+7 (903) 333-44-55" },
  "u-1004": { id: "u-1004", fio: "Кузнецов Дмитрий Олегович", phone: "+7 (904) 444-55-66" },
  "u-1005": { id: "u-1005", fio: "Смирнова Елена Викторовна", phone: "+7 (905) 555-66-77" },
  "u-1006": { id: "u-1006", fio: "Орлов Николай Андреевич", phone: "+7 (906) 666-77-88" }
};

const ownershipsById = {
  own_1: {
    cadastralNumber: "77:01:0001001:45",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
    vri: "Для размещения инженерной инфраструктуры",
    balanceHolder: { name: "ГБУ «Мосводоканалсеть»" }
  },
  own_2: {
    cadastralNumber: "77:01:0002002:17",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
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
    balanceHolder: { name: "ГБУ «Автомобильные дороги ЦАО»" }
  },
  own_3: {
    cadastralNumber: "77:01:0003003:9",
    ownershipForm: OWNERSHIP_FORMS.FEDERAL,
    vri: "Для размещения объектов энергоснабжения",
    balanceHolder: { name: "ПАО «Мосэнергосеть»" }
  },
  own_4: {
    cadastralNumber: "77:01:0003003:10",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
    vri: "Для размещения инженерной инфраструктуры",
    balanceHolder: { name: "ПАО «Мосэнергосеть»" }
  },
  own_5: {
    cadastralNumber: "77:01:0003003:11",
    ownershipForm: OWNERSHIP_FORMS.PRIVATE,
    vri: "Для эксплуатации трансформаторного пункта",
    balanceHolder: { name: "ПАО «Мосэнергосеть»" }
  },
  own_6: {
    cadastralNumber: "77:01:0005005:22",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
    vri: "Для размещения улично-дорожной сети",
    balanceHolder: { name: "ГБУ «Автодорсервис Басманный»" }
  },
  own_7: {
    cadastralNumber: "77:01:0006006:5",
    ownershipForm: OWNERSHIP_FORMS.REGIONAL,
    vri: "Требует уточнения",
    balanceHolder: { name: "Не определён" }
  },
  own_8: {
    cadastralNumber: "77:01:0006006:6",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
    vri: "Для обслуживания городской территории",
    balanceHolder: { name: "Не определён" }
  }
};

const pointEntities = {
  p1: {
    id: "p1",
    applicantId: "u-1001",
    ownershipIds: ["own_1"],
    requestType: REQUEST_TYPES.HOUSING_UTILITIES_NETWORKS,
    createdAt: "2026-04-29 09:15",
    plannedCloseAt: "2026-05-04 18:00",
    gar: {
      objectType: "Инженерные коммуникации",
      coordinate: "55.751244, 37.618423",
      municipalDistrict: "Центральный"
    },
    theme: "Ремонт коммуникаций",
    address: "Москва, ул. Примерная, 1",
    status: POINT_STATUSES.IN_PROGRESS,
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
    source: POINT_SOURCES.POS,
    relatedPoints: ["p3", "p1"],
    coords: [55.751244, 37.618423]
  },
  p2: {
    id: "p2",
    applicantId: "u-1002",
    ownershipIds: ["own_2"],
    requestType: REQUEST_TYPES.ROADS_PATCH_REPAIR,
    createdAt: "2026-04-29 10:05",
    plannedCloseAt: "2026-05-05 17:30",
    gar: {
      objectType: "Дорога местного значения",
      coordinate: "55.7608, 37.606",
      municipalDistrict: "Тверской"
    },
    theme: "Восстановление дорожного полотна",
    address: "Москва, пр-т Тестовый, 17",
    status: POINT_STATUSES.UNDER_REVIEW,
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
    source: POINT_SOURCES.SERVICE_112,
    relatedPoints: ["p5"],
    coords: [55.7608, 37.606]
  },
  p3: {
    id: "p3",
    applicantId: "u-1003",
    ownershipIds: ["own_3", "own_4", "own_5"],
    requestType: REQUEST_TYPES.POWER_SUPPLY_EMERGENCY,
    createdAt: "2026-04-28 21:40",
    plannedCloseAt: "2026-04-29 14:00",
    gar: {
      objectType: "Объект электросетевого хозяйства",
      coordinate: "55.739, 37.617",
      municipalDistrict: "Якиманка"
    },
    theme: "Устранение аварии электроснабжения",
    address: "Москва, ул. Сервисная, 9",
    status: POINT_STATUSES.COMPLETED,
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
    source: POINT_SOURCES.EDDS,
    relatedPoints: ["p1"],
    coords: [55.739, 37.617]
  },
  p4: {
    id: "p4",
    applicantId: "u-1004",
    ownershipIds: [],
    requestType: REQUEST_TYPES.IMPROVEMENT_CLEANING,
    createdAt: "2026-04-29 08:20",
    plannedCloseAt: "2026-05-03 16:00",
    gar: {
      objectType: "Общественная территория",
      coordinate: "55.7632, 37.5647",
      municipalDistrict: "Пресненский"
    },
    theme: "Очистка и благоустройство территории",
    address: "Москва, наб. Прототипная, 3",
    status: POINT_STATUSES.NEW,
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
    source: POINT_SOURCES.OFFLINE,
    relatedPoints: [],
    coords: [55.7632, 37.5647]
  },
  p5: {
    id: "p5",
    applicantId: "u-1005",
    ownershipIds: ["own_6"],
    requestType: REQUEST_TYPES.APPROVALS_WORK_SUSPENSION,
    createdAt: "2026-04-27 13:50",
    plannedCloseAt: "2026-05-10 12:00",
    gar: {
      objectType: "Улично-дорожная сеть",
      coordinate: "55.7492, 37.655",
      municipalDistrict: "Басманный"
    },
    theme: "Приостановка работ по согласованию",
    address: "Москва, ул. Адаптерная, 22",
    status: POINT_STATUSES.SUSPENDED,
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
    source: POINT_SOURCES.EMAIL,
    relatedPoints: ["p2"],
    coords: [55.7492, 37.655]
  },
  p6: {
    id: "p6",
    applicantId: "u-1006",
    ownershipIds: ["own_7", "own_8"],
    requestType: REQUEST_TYPES.QUALITY_CONTROL_CANCELLATION,
    createdAt: "2026-04-26 11:10",
    plannedCloseAt: "2026-04-26 12:00",
    gar: {
      objectType: "Городская территория",
      coordinate: "55.706, 37.61",
      municipalDistrict: "Донской"
    },
    theme: "Отмена заявки по причине несоответствия",
    address: "Москва, ул. Несовпадений, 5",
    status: POINT_STATUSES.CANCELED,
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
    source: POINT_SOURCES.POS,
    relatedPoints: [],
    coords: [55.706, 37.61]
  }
};

const buildPoint = (pointEntity) => {
  const { applicantId, ownershipIds, ...pointData } = pointEntity;
  return {
    ...pointData,
    applicant: applicantsById[applicantId] || null,
    ownerships: ownershipIds.map((ownershipId) => ownershipsById[ownershipId]).filter(Boolean)
  };
};

export const points = Object.values(pointEntities).map(buildPoint);

const DEFAULT_STATUS_BADGE = Object.freeze({
  bg: "bg-slate-50",
  text: "text-slate-700",
  border: "border-slate-200"
});

const statusToBadgeMap = {
  [POINT_STATUSES.NEW]: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  [POINT_STATUSES.IN_PROGRESS]: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  [POINT_STATUSES.UNDER_REVIEW]: { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" },
  [POINT_STATUSES.COMPLETED]: { bg: "bg-slate-50", text: "text-slate-800", border: "border-slate-200" },
  [POINT_STATUSES.SUSPENDED]: { bg: "bg-orange-50", text: "text-orange-900", border: "border-orange-200" },
  [POINT_STATUSES.CANCELED]: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" }
};

export const statusToBadge = (status) =>
  statusToBadgeMap[status] || DEFAULT_STATUS_BADGE;

export const statusToColorMap = {
  [POINT_STATUSES.NEW]: "#10b981",
  [POINT_STATUSES.IN_PROGRESS]: "#2563eb",
  [POINT_STATUSES.UNDER_REVIEW]: "#f59e0b",
  [POINT_STATUSES.COMPLETED]: "#334155",
  [POINT_STATUSES.SUSPENDED]: "#f97316",
  [POINT_STATUSES.CANCELED]: "#e11d48"
};

export const statusToColor = (status) => statusToColorMap[status] || "#64748b";

// JSON-матрица правил эскалации: категория обращения -> полномочия -> правило.
export const rules = {
  [REQUEST_TYPES.ROADS_PATCH_REPAIR]: {
    federal: {
      to: "ФКУ «Росавтодор» / территориальное управление",
      basis: "Постановление № 984 «О классификации автодорог»",
      attachments:
        "Выписка ГАР (тип дороги), координаты, фото, ссылка на классификатор"
    },
    regional: {
      to: "Региональный Минтранс / уполномоченный дорожный орган субъекта РФ",
      basis: "Постановление № 984 «О классификации автодорог»",
      attachments:
        "Выписка ГАР (тип дороги), координаты, фото, ссылка на классификатор"
    },
    private: {
      to: "Собственник дороги / эксплуатирующая организация",
      basis: "Постановление № 984 «О классификации автодорог»",
      attachments:
        "Выписка ГАР (тип дороги), координаты, фото, ссылка на классификатор"
    }
  },
  [REQUEST_TYPES.HOUSING_UTILITIES_NETWORKS]: {
    federal: {
      to: "МинЖКХ субъекта РФ / профильный федеральный регулятор",
      basis: "ФЗ-35 «Об электроэнергетике», региональные регламенты",
      attachments:
        "Схема сетей (если есть), балансодержатель из Росреестра, контакты собственника"
    },
    regional: {
      to: "Региональная энергетическая комиссия / МинЖКХ субъекта",
      basis: "ФЗ-35 «Об электроэнергетике», региональные регламенты",
      attachments:
        "Схема сетей (если есть), балансодержатель из Росреестра, контакты собственника"
    },
    private: {
      to: "Собственник / сетевая организация",
      basis: "ФЗ-35 «Об электроэнергетике», региональные регламенты",
      attachments:
        "Схема сетей (если есть), балансодержатель из Росреестра, контакты собственника"
    }
  },
  [REQUEST_TYPES.POWER_SUPPLY_EMERGENCY]: {
    federal: {
      to: "МинЖКХ субъекта РФ / профильный федеральный регулятор",
      basis: "ФЗ-35 «Об электроэнергетике», региональные регламенты",
      attachments:
        "Схема сетей (если есть), балансодержатель из Росреестра, контакты собственника"
    },
    regional: {
      to: "Региональная энергетическая комиссия / МинЖКХ субъекта",
      basis: "ФЗ-35 «Об электроэнергетике», региональные регламенты",
      attachments:
        "Схема сетей (если есть), балансодержатель из Росреестра, контакты собственника"
    },
    private: {
      to: "Собственник / сетевая организация",
      basis: "ФЗ-35 «Об электроэнергетике», региональные регламенты",
      attachments:
        "Схема сетей (если есть), балансодержатель из Росреестра, контакты собственника"
    }
  },
  [REQUEST_TYPES.IMPROVEMENT_CLEANING]: {
    federal: {
      to: "Минприроды РФ / Росприроднадзор",
      basis: "Лесной кодекс, ФЗ-7 «Об охране ОС»",
      attachments: "Координаты, данные ЕГРН о категории земли, фото"
    },
    regional: {
      to: "Региональный минэкологии / комитет по благоустройству",
      basis: "Лесной кодекс, ФЗ-7 «Об охране ОС»",
      attachments: "Координаты, данные ЕГРН о категории земли, фото"
    },
    private: {
      to: "Собственник территории / управляющая организация",
      basis: "Лесной кодекс, ФЗ-7 «Об охране ОС»",
      attachments: "Координаты, данные ЕГРН о категории земли, фото"
    }
  },
  [REQUEST_TYPES.APPROVALS_WORK_SUSPENSION]: {
    federal: {
      to: "Региональный Госстройнадзор / федеральный надзорный орган",
      basis: "ГрК РФ ст. 51, региональные правила землепользования",
      attachments: "Выписка ЕГРН, ГПЗУ (если есть), фото, обращение гражданина"
    },
    regional: {
      to: "Региональный Госстройнадзор / Комитет по архитектуре",
      basis: "ГрК РФ ст. 51, региональные правила землепользования",
      attachments: "Выписка ЕГРН, ГПЗУ (если есть), фото, обращение гражданина"
    },
    private: {
      to: "Собственник участка / застройщик (с уведомлением надзора)",
      basis: "ГрК РФ ст. 51, региональные правила землепользования",
      attachments: "Выписка ЕГРН, ГПЗУ (если есть), фото, обращение гражданина"
    }
  },
  [REQUEST_TYPES.QUALITY_CONTROL_CANCELLATION]: {
    federal: {
      to: "Профильный федеральный орган по предмету жалобы",
      basis: "Внутренний регламент обработки обращений",
      attachments: "Карточка обращения, история статусов, подтверждающие материалы"
    },
    regional: {
      to: "Профильный орган субъекта РФ по предмету жалобы",
      basis: "Внутренний регламент обработки обращений",
      attachments: "Карточка обращения, история статусов, подтверждающие материалы"
    },
    private: {
      to: "Ответственное юрлицо / владелец объекта",
      basis: "Внутренний регламент обработки обращений",
      attachments: "Карточка обращения, история статусов, подтверждающие материалы"
    }
  }
};

// Вынесено как константа, чтобы карта/рендер были независимыми.
export const YANDEX_MAPS_API_KEY = "6e36b74d-2152-4260-9127-6492ff601208";

export const MAP_CENTER_FALLBACK = points[0]?.coords || [55.751244, 37.618423];

