# Документация по проекту `prototype_ug`

## 1) Назначение проекта

`prototype_ug` — фронтенд-прототип диспетчера обращений.  
Система показывает обращения в трех представлениях (карта, таблица, карточки), позволяет открыть детальную модалку, автоматически собрать контекст (ГАР/Росреестр/контракты в виде прототипных данных), отрисовать аудит-лог и предложить оператору рекомендованное действие.

## 2) C4 (Context + Container + Component)

### C4 Level 1 — System Context

```mermaid
flowchart LR
  Operator["Оператор диспетчерской"] --> UI["Система prototype_ug"]

  UI --> POS["ПОС / источники обращений"]
  UI --> GAR["ГАР (адресно-территориальные данные)"]
  UI --> Rosreestr["Росреестр (собственность/балансодержатель)"]
  UI --> EIS["ЕИС / реестр контрактов"]
  UI --> Maps["Yandex Maps API"]
```

### C4 Level 2 — Containers

```mermaid
flowchart LR
  Operator["Оператор"] --> Browser["Web Browser"]

  subgraph Frontend["prototype_ug (Single Page App)"]
    AppShell["App shell: index.html + styles.css"]
    Core["JS Core: scripts/*.js (ES modules)"]
    Data["In-memory data: constants.js (points, rules, справочники)"]
  end

  Browser --> AppShell
  AppShell --> Core
  Core --> Data
  Core --> Maps["Yandex Maps API"]
```

### C4 Level 3 — Components (frontend)

```mermaid
flowchart TD
  Main["main.js"] --> ViewSwitch["viewSwitch.js"]
  Main --> Table["tableView.js"]
  Main --> Cards["cardsView.js"]
  Main --> Map["mapView.js"]
  Main --> Modal["modal.js"]

  Map --> Cnst["constants.js"]
  Table --> Cnst
  Cards --> Cnst
  Modal --> Cnst
  Modal --> Utils["utils.js"]
  Table --> Utils
  Cards --> Utils

  Modal --> UiFactory["uiFactory.js"]
  Modal --> ModalSummary["modalSummary.js"]
  Modal --> ModalSections["modalSections.js"]
  Modal --> ModalAudit["modalAudit.js"]
  Modal --> ModalActions["modalActions.js"]
  Modal --> ModalTabs["modalContextTabs.js"]
```

## 3) Компонентная диаграмма (UI и их ответственность)

```mermaid
flowchart LR
  Header["Header + Переключатель представлений"] --> ViewMap["View: Карта"]
  Header --> ViewTable["View: Таблица"]
  Header --> ViewCards["View: Карточки"]

  ViewMap --> Modal["Modal details"]
  ViewTable --> Modal
  ViewCards --> Modal

  Modal --> PhotoCarousel["Фото-карусель + бейдж верификации"]
  Modal --> ContextTabs["Контекстные вкладки"]
  Modal --> Actions["Блок действий оператора"]
  Modal --> Audit["Аудит-прогресс и лог"]

  ContextTabs --> Jurisdiction["Полномочия/собственность/балансодержатель"]
  ContextTabs --> Contracts["Контрактные обязательства"]
  ContextTabs --> Related["Похожие сообщения"]
  ContextTabs --> Audit
```

## 4) ER-диаграмма (логическая модель данных)

> В проекте используется in-memory модель в `constants.js`, но сущности ниже отражают текущую структуру.

```mermaid
erDiagram
  APPLICANT ||--o{ POINT : creates
  POINT }o--o{ OWNERSHIP : relates_to
  OWNERSHIP ||--o| CONTRACT : may_have
  POINT ||--o{ PHOTO : has
  POINT }o--o{ POINT : related_points

  APPLICANT {
    string id PK
    string fio
    string phone
  }

  POINT {
    string id PK
    string applicant_id FK
    string request_type
    string created_at
    string planned_close_at
    string theme
    string address
    string status
    string source
    string description
    string coords
  }

  OWNERSHIP {
    string id PK
    string cadastral_number
    string ownership_form
    string vri
    string balance_holder_name
  }

  CONTRACT {
    string number PK
    string date
    string subject
    string contractor
    string contractor_inn
    string amount
    string end_date
    string sla
    string penalty
  }

  PHOTO {
    string source
    string created_at
    string updated_at
    string coordinates
  }
```

## 5) Use Case диаграмма

```mermaid
flowchart LR
  Operator["Оператор"] --> UC1["Просмотреть обращения в таблице"]
  Operator --> UC2["Просмотреть обращения в карточках"]
  Operator --> UC3["Просмотреть обращения на карте"]
  Operator --> UC4["Открыть карточку обращения"]
  Operator --> UC5["Просмотреть контекстные вкладки"]
  Operator --> UC6["Просмотреть аудит-лог проверки"]
  Operator --> UC7["Принять рекомендованное действие"]
  Operator --> UC8["Открыть связанное обращение"]

  UC4 --> UC5
  UC5 --> UC6
  UC6 --> UC7
```

## 6) Диаграммы последовательности

### 6.1 Инициализация приложения

```mermaid
sequenceDiagram
  participant User as Оператор
  participant Main as main.js
  participant TV as tableView
  participant CV as cardsView
  participant VS as viewSwitch
  participant MV as mapView

  User->>Main: Открывает страницу
  Main->>TV: render(points, onOpenDetails)
  Main->>CV: render(points, onOpenDetails)
  Main->>VS: createViewSwitch(onChange)
  Main->>VS: setActive("cards")
  User->>VS: Переключает на "Карта"
  VS->>MV: init()
```

### 6.2 Открытие карточки из таблицы/карточек/карты

```mermaid
sequenceDiagram
  participant User as Оператор
  participant View as Table/Cards/Map
  participant Modal as modal.js
  participant Sections as modalSections
  participant Audit as modalAudit
  participant Actions as modalActions

  User->>View: Клик по обращению
  View->>Modal: open(item)
  Modal->>Modal: renderPhotoCarousel(item)
  Modal->>Sections: createModalSections(...)
  Modal->>Audit: createModalAuditSection(...)
  Modal->>Actions: createModalActionsBox(...)
  Modal->>Audit: startAuditProgress()
  Audit-->>Modal: onGarVerified/onPhotoVerified
  Audit-->>Actions: onRecommendationReady()
```

### 6.3 Инициализация карты и постановка меток

```mermaid
sequenceDiagram
  participant User as Оператор
  participant VS as viewSwitch
  participant MV as mapView
  participant YMaps as Yandex Maps API
  participant Modal as modal.js

  User->>VS: Выбирает "Карта"
  VS->>MV: init()
  MV->>MV: loadYmaps()
  MV->>YMaps: Подключение SDK + ymaps.ready
  YMaps-->>MV: Map ready
  MV->>MV: Создание map + placemark для points
  User->>MV: Клик по метке
  MV->>Modal: open(point)
```

## 7) Описание функций/модулей

- `main.js` — точка входа: создает `modal`, `tableView`, `cardsView`, `mapView`, связывает переходы между экранами.
- `viewSwitch.js` — переключение активного представления (`map/table/cards`) и визуального состояния кнопок.
- `tableView.js` — рендер табличного списка обращений и обработка клика по строке.
- `cardsView.js` — рендер Kanban-колонок по статусам (`STATUS_ORDER`) и карточек обращений.
- `mapView.js` — lazy-инициализация Яндекс Карт, построение меток по `points`, открытие модалки по клику.
- `modal.js` — оркестратор модалки: сбор сводки, фото-карусели, вкладок контекста, блока действий, жизненный цикл `open/close`.
- `modalSummary.js` — формирование верхнего summary-блока карточки обращения.
- `modalSections.js` — блоки полномочий/собственности, контрактов и похожих сообщений.
- `modalAudit.js` — сбор и проигрывание шагов аудита с прогрессом и триггерами (`onGarVerified`, `onPhotoVerified`, `onRecommendationReady`).
- `modalActions.js` — рекомендованные действия и массовые действия по связанным обращениям.
- `modalContextTabs.js` — универсальный контрол вкладок контекстных секций.
- `uiFactory.js` — фабрика вспомогательных UI-элементов (section/list wrappers).
- `utils.js` — базовые утилиты (`el`, `escapeHtml`, `groupBy`, `indexById`).
- `constants.js` — справочники, тестовые данные `points`, правила эскалации `rules`, цвета/бейджи/ключ карты.

## 8) Ключевые бизнес-правила в текущем прототипе

- Статусы обращения фиксированы в `POINT_STATUSES` и используются во всех представлениях.
- Колонки Kanban всегда отображаются по `STATUS_ORDER`, даже если в колонке 0 элементов.
- Рекомендованное действие в модалке зависит от комбинации:
  - уровня полномочий (муниципальный/региональный/федеральный/частный),
  - наличия контрактных обязательств,
  - найденного правила в `rules`.
- Проверка фото в прототипе основывается на совпадении:
  - координат (<= 200 м),
  - даты обновления фото и даты создания обращения.
- Прогресс аудита раскрывает шаги последовательно (таймером) и управляет отображением бейджей/рекомендаций.

