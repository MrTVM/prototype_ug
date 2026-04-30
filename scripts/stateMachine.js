import { POINT_STATUSES } from "./constants.js";

const STATUS_TRANSITIONS = Object.freeze({
  [POINT_STATUSES.NEW]: Object.freeze([
    POINT_STATUSES.IN_PROGRESS,
    POINT_STATUSES.SUSPENDED,
    POINT_STATUSES.CANCELED
  ]),
  [POINT_STATUSES.IN_PROGRESS]: Object.freeze([
    POINT_STATUSES.UNDER_REVIEW,
    POINT_STATUSES.SUSPENDED,
    POINT_STATUSES.CANCELED
  ]),
  [POINT_STATUSES.UNDER_REVIEW]: Object.freeze([
    POINT_STATUSES.COMPLETED,
    POINT_STATUSES.IN_PROGRESS,
    POINT_STATUSES.CANCELED
  ]),
  [POINT_STATUSES.SUSPENDED]: Object.freeze([
    POINT_STATUSES.IN_PROGRESS,
    POINT_STATUSES.CANCELED
  ]),
  [POINT_STATUSES.COMPLETED]: Object.freeze([]),
  [POINT_STATUSES.CANCELED]: Object.freeze([])
});

const normalizeStatus = (status) => String(status || "").trim();

export function getAllowedTransitions(status) {
  const normalizedStatus = normalizeStatus(status);
  return STATUS_TRANSITIONS[normalizedStatus] || [];
}

export function canTransition(fromStatus, toStatus) {
  const normalizedToStatus = normalizeStatus(toStatus);
  return getAllowedTransitions(fromStatus).includes(normalizedToStatus);
}

export function transitionPointStatus(point, nextStatus) {
  if (!point || typeof point !== "object") {
    throw new Error("Point is required for status transition.");
  }

  const currentStatus = normalizeStatus(point.status);
  const normalizedNextStatus = normalizeStatus(nextStatus);
  if (!normalizedNextStatus) {
    throw new Error("Next status is required.");
  }

  if (currentStatus === normalizedNextStatus) {
    return { changed: false, status: currentStatus };
  }

  if (!canTransition(currentStatus, normalizedNextStatus)) {
    const allowed = getAllowedTransitions(currentStatus);
    throw new Error(
      `Invalid status transition: "${currentStatus}" -> "${normalizedNextStatus}". Allowed: ${
        allowed.length > 0 ? allowed.join(", ") : "none"
      }`
    );
  }

  point.status = normalizedNextStatus;
  return { changed: true, status: normalizedNextStatus };
}
