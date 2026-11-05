export interface DeliveryMeal {
  name: string;
  price: string;
  quantity: number;
}

export interface OsrmRouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

export const deliveryMeals: DeliveryMeal[] = [
  { name: "Spicy Tofu Grain Bowl", price: "$44.00", quantity: 1 },
  { name: "Herb Chicken Rice Box", price: "$58.00", quantity: 2 },
  { name: "Roasted Veggie Wrap", price: "$29.00", quantity: 1 },
];

/** Pickup (origin) and dropoff (destination) coordinates. */
export const pickup = { lng: -73.9445, lat: 40.6885 };
export const dropoff = { lng: -73.959, lat: 40.685 };

/** Initial map viewport, fitted around pickup and dropoff. */
export const mapView = {
  bounds: [
    [Math.min(pickup.lng, dropoff.lng), Math.min(pickup.lat, dropoff.lat)],
    [Math.max(pickup.lng, dropoff.lng), Math.max(pickup.lat, dropoff.lat)],
  ] as [[number, number], [number, number]],
  padding: 72,
  minZoom: 12,
  maxZoom: 15,
};

/** Fraction of the route the courier has already covered (0–1). */
export const progressFraction = 0.45;

/**
 * OSRM demo routing endpoint. Swap in your own routing service by returning a
 * URL that responds with GeoJSON route geometry.
 */
export function buildRouteUrl(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number },
) {
  return `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
}

/**
 * Route line styling. WebGL paint can't read CSS variables, so colors are
 * concrete hex. `progress` highlights the covered path; `remaining` is themed
 * for the road still ahead.
 */
export const routeStyle = {
  progress: { color: "#3b82f6", width: 6, opacity: 0.95 },
  remaining: {
    width: 5.2,
    opacity: 0.5,
    color: { light: "#6b7280", dark: "#e5e7eb" },
  },
} as const;
