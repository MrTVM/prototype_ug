import { points } from "./constants.js";
import { createModal } from "./modal.js";
import { createViewSwitch } from "./viewSwitch.js";
import { createTableView } from "./tableView.js";
import { createCardsView } from "./cardsView.js";
import { createMapView } from "./mapView.js";
import { getAllowedTransitions, transitionPointStatus } from "./stateMachine.js";

const renderAll = (tableView, cardsView, onOpenDetails) => {
  tableView.render(points, onOpenDetails);
  cardsView.render(points, onOpenDetails);
};

const modal = createModal({
  statusMachine: {
    getAllowedTransitions,
    transitionPointStatus
  },
  onStatusChanged: () => renderAll(tableView, cardsView, onOpenDetails)
});
const tableView = createTableView();
const cardsView = createCardsView();
const mapView = createMapView({ modal });

const onOpenDetails = (item) => modal.open(item);

renderAll(tableView, cardsView, onOpenDetails);

const viewSwitch = createViewSwitch({
  onChange: (view) => {
    if (view === "map") mapView.init();
  }
});

// Быстрее показать карточки, чтобы не ждать загрузки карт
viewSwitch.setActive("cards");

