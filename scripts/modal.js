import { statusToBadge } from "./constants.js";
import { el } from "./utils.js";

export function createModal() {
  const modal = el("modal");
  const closeBtn = el("modal-close");
  const overlay = el("modal-overlay");

  const title = el("modal-title");
  const address = el("modal-address");
  const statusBadge = el("modal-status-badge");
  const description = el("modal-description");
  const photo = el("modal-photo");
  const source = el("modal-source");
  const action = el("modal-action");

  if (!modal) throw new Error('Missing element: "modal"');

  let isOpen = false;

  const setStatusBadge = (status) => {
    const b = statusToBadge(status);
    statusBadge.className = `inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${b.bg} ${b.text} border ${b.border}`;
    statusBadge.textContent = status;
  };

  const open = (item) => {
    title.textContent = item.theme;
    address.textContent = item.address;
    setStatusBadge(item.status);
    description.textContent = item.description;
    photo.src = item.photoSrc;

    source.textContent = item.source.replace(/^https?:\/\//, "");
    source.href = item.source;

    action.href = item.source;

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

