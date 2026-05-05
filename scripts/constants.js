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
  "u-1006": { id: "u-1006", fio: "Орлов Николай Андреевич", phone: "+7 (906) 666-77-88" },
  "u-1007": { id: "u-1007", fio: "Васильева Мария Павловна", phone: "+7 (907) 123-45-67" },
  "u-1008": { id: "u-1008", fio: "Егоров Сергей Михайлович", phone: "+7 (908) 234-56-78" },
  "u-1009": { id: "u-1009", fio: "Фёдоров Артём Игоревич", phone: "+7 (909) 345-67-89" },
  "u-1010": { id: "u-1010", fio: "Громова Оксана Валерьевна", phone: "+7 (910) 456-78-90" },
  "u-1011": { id: "u-1011", fio: "Беляев Роман Константинович", phone: "+7 (911) 567-89-01" },
  "u-1012": { id: "u-1012", fio: "Тихонова Нина Алексеевна", phone: "+7 (912) 678-90-12" }
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
  },
  own_9: {
    cadastralNumber: "77:01:0007007:14",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
    vri: "Для размещения тротуаров и пешеходных зон",
    balanceHolder: { name: "ГБУ «Жилищник Таганского района»" }
  },
  own_10: {
    cadastralNumber: "77:01:0007007:18",
    ownershipForm: OWNERSHIP_FORMS.PRIVATE,
    vri: "Для размещения нежилых административных объектов",
    balanceHolder: { name: "АО «Деловой квартал Садовое»" }
  },
  own_11: {
    cadastralNumber: "77:01:0008008:31",
    ownershipForm: OWNERSHIP_FORMS.REGIONAL,
    vri: "Для размещения объектов транспортной инфраструктуры",
    balanceHolder: { name: "ГКУ «Организатор перевозок»" }
  },
  own_12: {
    cadastralNumber: "77:01:0009009:2",
    ownershipForm: OWNERSHIP_FORMS.FEDERAL,
    vri: "Для размещения линейных объектов связи",
    balanceHolder: { name: "ФГБУ «Федеральный центр эксплуатации»" }
  },
  own_13: {
    cadastralNumber: "77:01:0010010:7",
    ownershipForm: OWNERSHIP_FORMS.MUNICIPAL,
    vri: "Для размещения объектов благоустройства",
    contract: {
      number: "88/26",
      date: "15.01.2026",
      subject: "Комплексная уборка и обслуживание общественных территорий",
      contractor: "ООО «ГородСервис+»",
      contractorInn: "7707654321",
      contact: "dispatch@gorservis.ru | +7 (495) 700-11-22",
      amount: "9,8 млн руб.",
      endDate: "31.12.2026",
      sla: "3 дня с момента фиксации",
      penalty: "0.2% от стоимости этапа / день"
    },
    balanceHolder: { name: "ГБУ «Автомобильные дороги ЮВАО»" }
  },
  own_14: {
    cadastralNumber: "77:01:0011011:11",
    ownershipForm: OWNERSHIP_FORMS.PRIVATE,
    vri: "Для размещения складских помещений",
    balanceHolder: { name: "ООО «ЛогистикПарк Нагатинский»" }
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
        source: "./src/photos/p1-before.svg",
        meta: {
          createdAt: "2026-04-28 08:50",
          updatedAt: "2026-04-28 09:05",
          coordinates: "55.751244, 37.618423"
        }
      },
      {
        source: "./src/photos/p1-before.svg",
        meta: {
          createdAt: "2026-04-29 08:52",
          updatedAt: "2026-04-29 09:06",
          coordinates: "55.751244, 37.618423"
        }
      },
      {
        source: "./src/photos/p1-before.svg",
        meta: {
          createdAt: "2026-04-29 08:55",
          updatedAt: "2026-04-29 09:10",
          coordinates: "55.751244, 37.618423"
        }
      }
    ],
    source: POINT_SOURCES.POS,
    relatedPoints: [],
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
        source: "./src/photos/p2-before.svg",
        meta: {
          createdAt: "2026-04-29 09:50",
          updatedAt: "2026-04-29 10:00",
          coordinates: "55.7608, 37.606"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p2-after.svg",
        meta: {
          createdAt: "2026-04-30 11:35",
          updatedAt: "2026-04-30 11:40",
          coordinates: "55.7608, 37.606"
        }
      }
    ],
    source: POINT_SOURCES.SERVICE_112,
    relatedPoints: ["p7"],
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
        source: "./src/photos/p3-before.svg",
        meta: {
          createdAt: "2026-04-27 21:15",
          updatedAt: "2026-04-27 21:30",
          coordinates: "55.739, 37.617"
        }
      },
      {
        source: "./src/photos/p3-before.svg",
        meta: {
          createdAt: "2026-04-27 21:20",
          updatedAt: "2026-04-27 21:35",
          coordinates: "55.739, 37.617"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p3-after.svg",
        meta: {
          createdAt: "2026-04-29 13:30",
          updatedAt: "2026-04-29 13:40",
          coordinates: "55.739, 37.617"
        }
      }
    ],
    source: POINT_SOURCES.EDDS,
    relatedPoints: ["p12"],
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
        source: "./src/photos/p4-before.svg",
        meta: {
          createdAt: "2026-04-29 08:00",
          updatedAt: "2026-04-29 08:10",
          coordinates: "55.7632, 37.5647"
        }
      },
      {
        source: "./src/photos/p4-before.svg",
        meta: {
          createdAt: "2026-04-29 08:05",
          updatedAt: "2026-04-29 08:15",
          coordinates: "55.7632, 37.5647"
        }
      },
      {
        source: "./src/photos/p4-before.svg",
        meta: {
          createdAt: "2026-04-29 08:08",
          updatedAt: "2026-04-29 08:18",
          coordinates: "55.7632, 37.5647"
        }
      }
    ],
    source: POINT_SOURCES.OFFLINE,
    relatedPoints: ["p10"],
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
        source: "./src/photos/p5-before.svg",
        meta: {
          createdAt: "2026-04-27 13:20",
          updatedAt: "2026-04-27 13:35",
          coordinates: "55.7492, 37.655"
        }
      },
      {
        source: "./src/photos/p5-before.svg",
        meta: {
          createdAt: "2026-04-27 13:25",
          updatedAt: "2026-04-27 13:40",
          coordinates: "55.7492, 37.655"
        }
      }
    ],
    source: POINT_SOURCES.EMAIL,
    relatedPoints: ["p8"],
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
        source: "./src/photos/p6-before.svg",
        meta: {
          createdAt: "2026-04-26 10:45",
          updatedAt: "2026-04-26 10:55",
          coordinates: "55.706, 37.61"
        }
      },
      {
        source: "./src/photos/p6-before.svg",
        meta: {
          createdAt: "2026-04-26 10:50",
          updatedAt: "2026-04-26 11:00",
          coordinates: "55.706, 37.61"
        }
      }
    ],
    source: POINT_SOURCES.POS,
    relatedPoints: ["p11"],
    coords: [55.706, 37.61]
  },
  p7: {
    id: "p7",
    applicantId: "u-1007",
    ownershipIds: ["own_9"],
    requestType: REQUEST_TYPES.ROADS_PATCH_REPAIR,
    createdAt: "2026-04-30 07:42",
    plannedCloseAt: "2026-05-06 20:00",
    gar: {
      objectType: "Пешеходная инфраструктура",
      coordinate: "55.7429, 37.6538",
      municipalDistrict: "Таганский"
    },
    theme: "Просадка тротуарной плитки у остановки",
    address: "Москва, пр-т Тестовый, 17",
    status: POINT_STATUSES.IN_PROGRESS,
    description:
      "У остановки образовалась просадка тротуарной плитки после дождя.\nНужно восстановить покрытие и проверить основание.",
    photoGallery: [
      {
        source: "./src/photos/p7-before.svg",
        meta: {
          createdAt: "2026-04-30 07:31",
          updatedAt: "2026-04-30 07:40",
          coordinates: "55.7429, 37.6538"
        }
      },
      {
        source: "./src/photos/p7-before.svg",
        meta: {
          createdAt: "2026-04-30 07:33",
          updatedAt: "2026-04-30 07:41",
          coordinates: "55.7429, 37.6538"
        }
      }
    ],
    source: POINT_SOURCES.POS,
    relatedPoints: ["p2"],
    coords: [55.7429, 37.6538]
  },
  p8: {
    id: "p8",
    applicantId: "u-1008",
    ownershipIds: ["own_10", "own_11"],
    requestType: REQUEST_TYPES.APPROVALS_WORK_SUSPENSION,
    createdAt: "2026-04-30 11:12",
    plannedCloseAt: "2026-05-12 18:00",
    gar: {
      objectType: "Зона строительства",
      coordinate: "55.7577, 37.6153",
      municipalDistrict: "Тверской"
    },
    theme: "Шумные ночные работы без ограждения",
    address: "Москва, ул. Адаптерная, 22",
    status: POINT_STATUSES.UNDER_REVIEW,
    description:
      "На площадке ведутся ночные работы, ограждение частично демонтировано.\nНужно проверить документы и приостановить работы до устранения нарушений.",
    photoGallery: [
      {
        source: "./src/photos/p8-before.svg",
        meta: {
          createdAt: "2026-04-30 11:00",
          updatedAt: "2026-04-30 11:09",
          coordinates: "55.7599, 37.619"
        }
      }
    ],
    source: POINT_SOURCES.SERVICE_112,
    relatedPoints: ["p5"],
    coords: [55.7577, 37.6153]
  },
  p9: {
    id: "p9",
    applicantId: "u-1009",
    ownershipIds: ["own_12"],
    requestType: REQUEST_TYPES.HOUSING_UTILITIES_NETWORKS,
    createdAt: "2026-04-30 03:18",
    plannedCloseAt: "2026-04-30 09:00",
    gar: {
      objectType: "Колодец инженерных сетей",
      coordinate: "55.7332, 37.5884",
      municipalDistrict: "Хамовники"
    },
    theme: "Открытый люк на техническом колодце",
    address: "Москва, Комсомольский пр-т, 26",
    status: POINT_STATUSES.COMPLETED,
    description:
      "Люк был открыт, вокруг отсутствовали предупреждающие знаки.\nУчасток оперативно оградили и закрыли колодец.",
    photoGallery: [
      {
        source: "./src/photos/p9-before.svg",
        meta: {
          createdAt: "2026-04-30 03:05",
          updatedAt: "2026-04-30 03:14",
          coordinates: "55.7332, 37.5884"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p9-after.svg",
        meta: {
          createdAt: "2026-04-30 08:45",
          updatedAt: "2026-04-30 08:50",
          coordinates: "55.7332, 37.5884"
        }
      }
    ],
    source: POINT_SOURCES.EDDS,
    relatedPoints: [],
    coords: [55.7332, 37.5884]
  },
  p10: {
    id: "p10",
    applicantId: "u-1010",
    ownershipIds: ["own_13"],
    requestType: REQUEST_TYPES.IMPROVEMENT_CLEANING,
    createdAt: "2026-04-29 22:50",
    plannedCloseAt: "2026-05-02 16:00",
    gar: {
      objectType: "Дворовая территория",
      coordinate: "55.6998, 37.7274",
      municipalDistrict: "Люблино"
    },
    theme: "Скопление крупногабаритного мусора во дворе",
    address: "Москва, наб. Прототипная, 3",
    status: POINT_STATUSES.NEW,
    description:
      "Во дворе складированы старые шкафы и строительный мусор.\nТребуется вывоз КГМ и санитарная обработка участка.",
    photoGallery: [
      {
        source: "./src/photos/p10-before.svg",
        meta: {}
      }
    ],
    source: POINT_SOURCES.EMAIL,
    relatedPoints: ["p4"],
    coords: [55.6998, 37.7274]
  },
  p11: {
    id: "p11",
    applicantId: "u-1011",
    ownershipIds: ["own_14"],
    requestType: REQUEST_TYPES.QUALITY_CONTROL_CANCELLATION,
    createdAt: "2026-04-28 15:22",
    plannedCloseAt: "2026-04-28 18:00",
    gar: {
      objectType: "Производственная площадка",
      coordinate: "55.6894, 37.6481",
      municipalDistrict: "Нагатинский Затон"
    },
    theme: "Дублирующее сообщение без новых фактов",
    address: "Москва, ул. Несовпадений, 5",
    status: POINT_STATUSES.CANCELED,
    description:
      "Сообщение признано дублирующим существующий кейс.\nНовые материалы не приложены, карточка закрыта по регламенту.",
    photoGallery: [
      {
        source: "./src/photos/p11-before.svg",
        meta: {
          createdAt: "2026-04-28 15:00",
          updatedAt: "2026-04-27 15:10",
          coordinates: "55.6894, 37.6481"
        }
      }
    ],
    source: POINT_SOURCES.OFFLINE,
    relatedPoints: ["p6"],
    coords: [55.6894, 37.6481]
  },
  p12: {
    id: "p12",
    applicantId: "u-1012",
    ownershipIds: [],
    requestType: REQUEST_TYPES.POWER_SUPPLY_EMERGENCY,
    createdAt: "2026-04-30 12:28",
    plannedCloseAt: "2026-04-30 16:00",
    gar: {
      objectType: "",
      coordinate: "55.7811, 37.7003",
      municipalDistrict: "Сокольники"
    },
    theme: "Кратковременные отключения света в доме",
    address: "Москва, ул. Сервисная, 9",
    status: POINT_STATUSES.SUSPENDED,
    description:
      "Зафиксированы повторные отключения электроснабжения в вечернее время.\nДо уточнения балансовой принадлежности заявка временно приостановлена.",
    photoGallery: [
      {
        source: "./src/photos/p12-before.svg",
        meta: {}
      }
    ],
    source: "",
    relatedPoints: ["p3"],
    coords: [55.7811, 37.7003]
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

// JSON-матрица правил эскалации: категория сообщения -> полномочия -> правило.
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
      attachments: "Выписка ЕГРН, ГПЗУ (если есть), фото, сообщение гражданина"
    },
    regional: {
      to: "Региональный Госстройнадзор / Комитет по архитектуре",
      basis: "ГрК РФ ст. 51, региональные правила землепользования",
      attachments: "Выписка ЕГРН, ГПЗУ (если есть), фото, сообщение гражданина"
    },
    private: {
      to: "Собственник участка / застройщик (с уведомлением надзора)",
      basis: "ГрК РФ ст. 51, региональные правила землепользования",
      attachments: "Выписка ЕГРН, ГПЗУ (если есть), фото, сообщение гражданина"
    }
  },
  [REQUEST_TYPES.QUALITY_CONTROL_CANCELLATION]: {
    federal: {
      to: "Профильный федеральный орган по предмету жалобы",
      basis: "Внутренний регламент обработки сообщений",
      attachments: "Карточка сообщения, история статусов, подтверждающие материалы"
    },
    regional: {
      to: "Профильный орган субъекта РФ по предмету жалобы",
      basis: "Внутренний регламент обработки сообщений",
      attachments: "Карточка сообщения, история статусов, подтверждающие материалы"
    },
    private: {
      to: "Ответственное юрлицо / владелец объекта",
      basis: "Внутренний регламент обработки сообщений",
      attachments: "Карточка сообщения, история статусов, подтверждающие материалы"
    }
  }
};

// Вынесено как константа, чтобы карта/рендер были независимыми.
export const YANDEX_MAPS_API_KEY = "6e36b74d-2152-4260-9127-6492ff601208";

export const MAP_CENTER_FALLBACK = points[0]?.coords || [55.751244, 37.618423];

