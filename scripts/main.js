import { points } from "./constants.js";
import { createModal } from "./modal.js";
import { createViewSwitch } from "./viewSwitch.js";
import { createTableView } from "./tableView.js";
import { createCardsView } from "./cardsView.js";
import { createMapView } from "./mapView.js";

const modal = createModal();
const tableView = createTableView();
const cardsView = createCardsView();
const mapView = createMapView({ modal });

const onOpenDetails = (item) => modal.open(item);

tableView.render(points, onOpenDetails);
cardsView.render(points, onOpenDetails);

const viewSwitch = createViewSwitch({
  onChange: (view) => {
    if (view === "map") mapView.init();
  }
});

// Быстрее показать карточки, чтобы не ждать загрузки карт
viewSwitch.setActive("cards");

