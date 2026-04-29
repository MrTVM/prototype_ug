import {
  MAP_CENTER_FALLBACK,
  YANDEX_MAPS_API_KEY,
  points,
  statusToColor
} from "./constants.js";

export function createMapView({ modal } = {}) {
  const mapEl = document.getElementById("yandex-map");
  const fallback = document.getElementById("map-fallback");

  if (!mapEl || !fallback) {
    throw new Error('Missing elements: "yandex-map" / "map-fallback"');
  }

  let map = null;
  let initPromise = null;

  const markerSvgDataUri = (color) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(15,23,42,0.25)"/>
          </filter>
        </defs>
        <path filter="url(#s)" d="M20 2C12 2 6 8 6 16c0 12 14 22 14 22s14-10 14-22c0-8-6-14-14-14z" fill="${color}"/>
        <circle cx="20" cy="16" r="6" fill="white" opacity="0.95"/>
      </svg>
    `.trim();

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const loadYmaps = () => {
    if (window.ymaps) return Promise.resolve();

    // Удерживаем старую логику из прототипа:
    // если ключ не задан — просто не инициализируем карту.
    if (!YANDEX_MAPS_API_KEY || YANDEX_MAPS_API_KEY === "YOUR_API_KEY") {
      return Promise.reject(new Error("Yandex Maps API key not set"));
    }

    return new Promise((resolve, reject) => {
      const scriptId = "yandex-maps-script";
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Yandex maps script failed")),
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${encodeURIComponent(
        YANDEX_MAPS_API_KEY
      )}&load=package.full`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Yandex maps script failed"));
      document.head.appendChild(script);
    });
  };

  const initMap = async () => {
    fallback.classList.remove("hidden");

    try {
      await loadYmaps();
      if (!window.ymaps) throw new Error("ymaps is not available after load");

      await new Promise((resolve) => window.ymaps.ready(resolve));

      const coords = points.map((p) => p.coords).filter(Boolean);
      const center = coords[0] || MAP_CENTER_FALLBACK;

      map = new window.ymaps.Map(
        mapEl,
        {
          center,
          zoom: 11
        },
        {
          searchControlProvider: "yandex#search"
        }
      );

      // Убираем fallback после успешной отрисовки
      fallback.classList.add("hidden");

      // Добавляем метки
      points.forEach((p) => {
        const placemark = new window.ymaps.Placemark(
          p.coords,
          { balloonContent: "" },
          {
            iconLayout: "default#image",
            iconImageHref: markerSvgDataUri(statusToColor(p.status)),
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40]
          }
        );

        placemark.events.add("click", () => modal.open(p));
        map.geoObjects.add(placemark);
      });

      // Подстроить приближение по точкам
      if (coords.length > 1) {
        const bounds = window.ymaps.util.bounds.fromPoints(coords);
        map.setBounds(bounds, { checkZoomRange: true });
      }
    } catch (err) {
      console.warn("Yandex map init failed:", err);
    }
  };

  return {
    init: async () => {
      if (map) return;
      if (initPromise) return initPromise;
      initPromise = initMap().finally(() => {
        initPromise = null;
      });
      return initPromise;
    }
  };
}

