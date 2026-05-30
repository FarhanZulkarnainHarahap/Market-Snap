import { stores } from "./market-data";
import type { Store } from "./types";

export type UserPoint = { lat: number; lng: number };

export function nearestStore(point?: UserPoint) {
  if (!point) return { store: stores[0], distanceKm: 0, serviceable: true };
  const ranked = stores
    .map((store) => ({ store, distanceKm: distanceKm(point, store) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  const result = ranked[0];
  return { ...result, serviceable: result.distanceKm <= result.store.radiusKm };
}

export function distanceKm(from: UserPoint, to: Pick<Store, "lat" | "lng">) {
  const earth = 6371;
  const dLat = radians(to.lat - from.lat);
  const dLng = radians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function radians(value: number) {
  return (value * Math.PI) / 180;
}
