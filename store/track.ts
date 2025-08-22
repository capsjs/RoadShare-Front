import { create } from "zustand";

export type TrackPoint = {
  latitude: number;
  longitude: number;
  timestamp: number; // ms epoch
};

type TrackState = {
  isTracking: boolean;
  points: TrackPoint[];
  distanceMeters: number; // cumulé
  start: () => void;
  stop: () => void;
  reset: () => void;
  addPoint: (p: TrackPoint) => void;
};

function haversine(a: TrackPoint, b: TrackPoint) {
  const R = 6371000; // m
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const useTrackStore = create<TrackState>((set, get) => ({
  isTracking: false,
  points: [],
  distanceMeters: 0,
  start: () => set({ isTracking: true, points: [], distanceMeters: 0 }),
  stop: () => set({ isTracking: false }),
  reset: () => set({ points: [], distanceMeters: 0 }),
  addPoint: (p) => {
    const { points, distanceMeters } = get();
    const last = points[points.length - 1];
    const delta = last ? haversine(last, p) : 0;
    set({ points: [...points, p], distanceMeters: distanceMeters + delta });
  },
}));
