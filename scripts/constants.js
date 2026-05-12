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
    contract: {
      number: "СФ-УДС/12-26",
      date: "12.04.2026",
      subject:
        "Техническое обслуживание и аварийное восстановление светофорных объектов на участках УДС местного значения",
      contractor: "ООО «Транспортные системы — Курск»",
      contractorInn: "4632123456",
      contact: "dispatch@tsk-kursk.ru | +7 (4712) 33-44-55",
      amount: "6,1 млн руб.",
      endDate: "31.12.2027",
      sla: "24 часа с момента фиксации отказа контроллера / аварии по светофору",
      penalty: "0,1% от цены этапа за каждый день просрочки устранения"
    },
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
    contract: {
      number: "НО-7/26",
      date: "01.02.2026",
      subject: "Содержание сетей наружного освещения и аварийное восстановление",
      contractor: "ООО «ГорСвет+»",
      contractorInn: "4610011122",
      contact: "avaria@gorsvetplus.ru | +7 (4712) 55-66-77",
      amount: "4,2 млн руб.",
      endDate: "31.12.2026",
      sla: "48 часов с момента фиксации аварии по наружному освещению",
      penalty: "0,15% от цены этапа за каждый день просрочки"
    },
    balanceHolder: { name: "ГБУ «Курск — наружное освещение»" }
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
    ownershipIds: ["own_11"],
    requestType: REQUEST_TYPES.ROADS_PATCH_REPAIR,
    createdAt: "2026-05-10 08:10",
    plannedCloseAt: "2026-05-17 18:00",
    gar: {
      objectType: "Дорога регионального значения",
      coordinate: "51.765908, 36.222592",
      municipalDistrict: "Центральный округ"
    },
    theme: "Нарушение дорожного покрытия на региональной дороге",
    address: "Курск, ул. Дубровинского",
    status: POINT_STATUSES.COMPLETED,
    description:
      "Основано на реальном сообщении о ямах на региональной дороге.\nСтатус ожидает подтверждения от профильного ведомства.",
    photoGallery: [
      {
        source: "./src/photos/p1-before.webp",
        meta: {
          createdAt: "2026-05-10 07:55",
          updatedAt: "2026-05-10 08:05",
          coordinates: "51.765908, 36.222592"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p1-after.webp",
        meta: {
          createdAt: "2026-05-11 16:40",
          updatedAt: "2026-05-11 16:55",
          coordinates: "51.765908, 36.222592"
        }
      }
    ],
    source: POINT_SOURCES.POS,
    relatedPoints: ["p4"],
    commentIds: [],
    coords: [51.765908, 36.222592]
  },
  p2: {
    id: "p2",
    applicantId: "u-1002",
    ownershipIds: ["own_6"],
    requestType: REQUEST_TYPES.ROADS_PATCH_REPAIR,
    createdAt: "2026-05-10 08:45",
    plannedCloseAt: "2026-05-18 16:30",
    gar: {
      objectType: "Светофорный объект",
      coordinate: "51.728626, 36.109831",
      municipalDistrict: "Сеймский округ"
    },
    theme: "Светофоры на дорогах в границах поселений",
    address: "Курск, пр. Дружбы, 114",
    status: POINT_STATUSES.UNDER_REVIEW,
    description:
      "Синтетический кейс по теме из CSV: отказ контроллера светофора.\nТребуется подтверждение выезда и временная схема движения.",
    photoGallery: [
      {
        source: "./src/photos/p2-before.webp",
        meta: {
          createdAt: "2026-05-10 08:20",
          updatedAt: "2026-05-10 08:35",
          coordinates: "51.728626, 36.109831"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p2-after.webp",
        meta: {
          createdAt: "2026-05-11 12:05",
          updatedAt: "2026-05-11 12:15",
          coordinates: "51.728626, 36.109831"
        }
      }
    ],
    source: POINT_SOURCES.SERVICE_112,
    relatedPoints: [],
    commentIds: [],
    coords: [51.728626, 36.109831]
  },
  p3: {
    id: "p3",
    applicantId: "u-1003",
    ownershipIds: ["own_10"],
    requestType: REQUEST_TYPES.IMPROVEMENT_CLEANING,
    createdAt: "2026-05-10 09:20",
    plannedCloseAt: "2026-05-18 20:00",
    gar: {
      objectType: "Парковочное пространство",
      coordinate: "51.753541, 36.203372",
      municipalDistrict: "Центральный округ"
    },
    theme: "Парковки на дорогах в границах городских округов",
    address: "г.о. Курск, Центральный округ",
    status: POINT_STATUSES.NEW,
    description:
      "Въезд на парковку занят строительными блоками.\nКейс отражает проблему содержания прилегающей территории.",
    photoGallery: [
      {
        source: "./src/photos/p3-before.webp",
        meta: {
          createdAt: "2026-05-10 09:10",
          updatedAt: "2026-05-10 09:15",
          coordinates: "51.753541, 36.203372"
        }
      }
    ],
    source: POINT_SOURCES.OFFLINE,
    relatedPoints: ["p10"],
    commentIds: [],
    coords: [51.753541, 36.203372]
  },
  p4: {
    id: "p4",
    applicantId: "u-1004",
    ownershipIds: ["own_2"],
    requestType: REQUEST_TYPES.ROADS_PATCH_REPAIR,
    createdAt: "2026-05-10 10:00",
    plannedCloseAt: "2026-05-17 14:00",
    gar: {
      objectType: "Дорога местного значения",
      coordinate: "51.730846, 36.193015",
      municipalDistrict: "Центральный округ"
    },
    theme: "Ямы на дорогах местного значения",
    address: "Курск, Красная площадь, 1",
    status: POINT_STATUSES.IN_PROGRESS,
    description:
      "Дефекты покрытия у административного здания.\nЕсть действующий контракт на содержание дорог.",
    photoGallery: [
      {
        source: "./src/photos/p4-before.webp",
        meta: {
          createdAt: "2026-05-10 09:35",
          updatedAt: "2026-05-10 09:45",
          coordinates: "51.730846, 36.193015"
        }
      }
    ],
    source: POINT_SOURCES.EDDS,
    relatedPoints: ["p1"],
    commentIds: [],
    coords: [51.730846, 36.193015]
  },
  p5: {
    id: "p5",
    applicantId: "u-1005",
    ownershipIds: ["own_1"],
    requestType: REQUEST_TYPES.HOUSING_UTILITIES_NETWORKS,
    createdAt: "2026-05-10 10:40",
    plannedCloseAt: "2026-06-06 18:00",
    gar: {
      objectType: "Коммуникационный колодец",
      coordinate: "51.726110, 36.166901",
      municipalDistrict: "Центральный округ"
    },
    theme: "Отсутствие люков на коммуникационных колодцах",
    address: "Курск, ул. Павлуновского, 55",
    status: POINT_STATUSES.IN_PROGRESS,
    description:
      "Люк отсутствует, место ограждено сигнальной лентой.\nНеобходим срочный монтаж и проверка шахты.",
    photoGallery: [
      {
        source: "./src/photos/p5-before.webp",
        meta: {
          createdAt: "2026-05-10 10:25",
          updatedAt: "2026-05-10 10:30",
          coordinates: "51.726110, 36.166901"
        }
      }
    ],
    source: POINT_SOURCES.EMAIL,
    relatedPoints: [],
    commentIds: [],
    coords: [51.72611, 36.166901]
  },
  p8: {
    id: "p8",
    applicantId: "u-1008",
    ownershipIds: ["own_3", "own_4", "own_5"],
    requestType: REQUEST_TYPES.POWER_SUPPLY_EMERGENCY,
    createdAt: "2026-05-10 12:15",
    plannedCloseAt: "2026-05-17 18:00",
    gar: {
      objectType: "Наружное освещение",
      coordinate: "51.675125, 36.095808",
      municipalDistrict: "Железнодорожный округ"
    },
    theme: "Неработающее наружное освещение",
    address: "Курск, ул. Родниковая, 14А",
    status: POINT_STATUSES.IN_PROGRESS,
    description:
      "Не работает линия уличного освещения на квартале.\nТребуется определить балансодержателя и восстановить питание.",
    photoGallery: [
      {
        source: "./src/photos/p8-before.webp",
        meta: {
          createdAt: "2026-05-10 12:00",
          updatedAt: "2026-05-10 12:10",
          coordinates: "51.675125, 36.095808"
        }
      }
    ],
    source: POINT_SOURCES.EDDS,
    relatedPoints: ["p12"],
    commentIds: [],
    coords: [51.675125, 36.095808]
  },
  p10: {
    id: "p10",
    applicantId: "u-1010",
    ownershipIds: ["own_10"],
    requestType: REQUEST_TYPES.IMPROVEMENT_CLEANING,
    createdAt: "2026-05-10 13:20",
    plannedCloseAt: "2026-05-19 18:00",
    gar: {
      objectType: "Парковочное пространство",
      coordinate: "51.753541, 36.203372",
      municipalDistrict: "Центральный округ"
    },
    theme: "Парковки на дорогах в границах городских округов",
    address: "г.о. Курск, Центральный округ",
    status: POINT_STATUSES.CANCELED,
    description:
      "Друзья, кто-нибудь знает, чьи строительные блоки перекрыли въезд на парковку? Машину поставить невозможно.",
    photoGallery: [
      {
        source: "./src/photos/p3-before.webp",
        meta: {
          createdAt: "2026-05-10 09:10",
          updatedAt: "2026-05-10 09:15",
          coordinates: "51.753541, 36.203372"
        }
      }
    ],
    source: POINT_SOURCES.EMAIL,
    relatedPoints: ["p3"],
    commentIds: [],
    coords: [51.753541, 36.203372]
  },
  p12: {
    id: "p12",
    applicantId: "u-1012",
    ownershipIds: ["own_8"],
    requestType: REQUEST_TYPES.POWER_SUPPLY_EMERGENCY,
    createdAt: "2026-05-10 14:40",
    plannedCloseAt: "2026-05-22 18:00",
    gar: {
      objectType: "Опора наружного освещения",
      coordinate: "51.682400, 36.092100",
      municipalDistrict: "Железнодорожный округ"
    },
    theme: "Наружное освещение требует согласования земляных работ",
    address: "Курск, ул. Родниковая, 14А",
    status: POINT_STATUSES.SUSPENDED,
    description:
      "Для ремонта сети требуется согласование вскрытия покрытия.\nДо получения документов работы приостановлены.",
    photoGallery: [
      {
        source: "./src/photos/p12-before.webp",
        meta: {
          createdAt: "2026-05-10 14:20",
          updatedAt: "2026-05-10 14:30",
          coordinates: "51.682400, 36.092100"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p12-after.webp",
        meta: {
          createdAt: "2026-05-12 12:30",
          updatedAt: "2026-05-12 12:40",
          coordinates: "51.682400, 36.092100"
        }
      }
    ],
    source: POINT_SOURCES.POS,
    relatedPoints: ["p8"],
    commentIds: ["cm_p12_01", "cm_p12_02", "cm_p12_03", "cm_p12_04"],
    coords: [51.6824, 36.0921]
  },
  p13: {
    id: "p13",
    applicantId: "u-1009",
    ownershipIds: ["own_4"],
    requestType: REQUEST_TYPES.POWER_SUPPLY_EMERGENCY,
    createdAt: "2026-05-10 15:10",
    plannedCloseAt: "2026-05-18 10:00",
    gar: {
      objectType: "Линия наружного освещения",
      coordinate: "51.689900, 36.110700",
      municipalDistrict: "Железнодорожный округ"
    },
    theme: "Неработающее наружное освещение у школы",
    address: "Курск, ул. Вокзальная, 20",
    status: POINT_STATUSES.COMPLETED,
    description:
      "Линия восстановлена аварийной бригадой.\nПриложены фотографии до и после ремонта.",
    photoGallery: [
      {
        source: "./src/photos/p13-before.webp",
        meta: {
          createdAt: "2026-05-10 14:55",
          updatedAt: "2026-05-10 15:05",
          coordinates: "51.689900, 36.110700"
        }
      }
    ],
    photoAfterGallery: [
      {
        source: "./src/photos/p13-after.webp",
        meta: {
          createdAt: "2026-05-11 09:40",
          updatedAt: "2026-05-11 09:45",
          coordinates: "51.689900, 36.110700"
        }
      }
    ],
    source: POINT_SOURCES.EDDS,
    relatedPoints: [],
    commentIds: [],
    coords: [51.6899, 36.1107]
  }
};

/** Комментарии пользователей (прототип). Связь с сообщением — через `commentIds` в сущности точки. */
const messageCommentsById = {
  cm_p12_01: {
    id: "cm_p12_01",
    createdAt: "2026-05-10 14:42",
    author: "Громова О. В.",
    text: "Работы приостановлены: нет разрешения на вскрытие покрытия, запрос в МКУ направлен."
  },
  cm_p12_02: {
    id: "cm_p12_02",
    createdAt: "2026-05-11 09:15",
    author: "Беляев Р. К.",
    text: "Подрядчик подтвердил готовность после получения согласования, ждём ответ МКУ."
  },
  cm_p12_03: {
    id: "cm_p12_03",
    createdAt: "2026-05-12 12:45",
    author: "Тихонова Н. А.",
    text: "Фото «после» частичных подготовительных работ загружены для истории; статус остаётся приостановлено до пакета документов."
  },
  cm_p12_04: {
    id: "cm_p12_04",
    createdAt: "2026-05-12 13:10",
    author: "Иванов И. И.",
    text: "Напоминание: при возобновлении проверить SLA по договору НО-7/26."
  }
};

const buildPoint = (pointEntity) => {
  const { applicantId, ownershipIds, commentIds, ...pointData } = pointEntity;
  return {
    ...pointData,
    applicant: applicantsById[applicantId] || null,
    ownerships: ownershipIds.map((ownershipId) => ownershipsById[ownershipId]).filter(Boolean),
    comments: (commentIds || []).map((commentId) => messageCommentsById[commentId]).filter(Boolean)
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

