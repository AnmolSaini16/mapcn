export interface Hub {
  id: string;
  city: string;
  lng: number;
  lat: number;
  type: "primary" | "secondary";
  shipments: number;
  region: "west" | "midwest" | "south" | "northeast";
}

export interface Route {
  from: string;
  to: string;
  mode: "air" | "ground";
  shipments: number;
  status: "active" | "delayed";
}

export const hubs: Hub[] = [
  {
    id: "ord",
    city: "Chicago",
    lng: -87.6298,
    lat: 41.8781,
    type: "primary",
    shipments: 1247,
    region: "midwest",
  },
  {
    id: "lax",
    city: "Los Angeles",
    lng: -118.2437,
    lat: 34.0522,
    type: "primary",
    shipments: 1102,
    region: "west",
  },
  {
    id: "jfk",
    city: "New York",
    lng: -73.9352,
    lat: 40.6413,
    type: "primary",
    shipments: 983,
    region: "northeast",
  },
  {
    id: "dfw",
    city: "Dallas",
    lng: -96.797,
    lat: 32.8968,
    type: "primary",
    shipments: 856,
    region: "south",
  },
  {
    id: "atl",
    city: "Atlanta",
    lng: -84.4281,
    lat: 33.6407,
    type: "primary",
    shipments: 914,
    region: "south",
  },
  {
    id: "den",
    city: "Denver",
    lng: -104.6731,
    lat: 39.8617,
    type: "secondary",
    shipments: 634,
    region: "west",
  },
  {
    id: "sea",
    city: "Seattle",
    lng: -122.3321,
    lat: 47.6062,
    type: "secondary",
    shipments: 723,
    region: "west",
  },
  {
    id: "mia",
    city: "Miami",
    lng: -80.1918,
    lat: 25.7617,
    type: "secondary",
    shipments: 478,
    region: "south",
  },
  {
    id: "phx",
    city: "Phoenix",
    lng: -112.074,
    lat: 33.4484,
    type: "secondary",
    shipments: 512,
    region: "west",
  },
  {
    id: "iah",
    city: "Houston",
    lng: -95.3698,
    lat: 29.9844,
    type: "secondary",
    shipments: 698,
    region: "south",
  },
  {
    id: "bos",
    city: "Boston",
    lng: -71.0054,
    lat: 42.3643,
    type: "secondary",
    shipments: 534,
    region: "northeast",
  },
  {
    id: "sfo",
    city: "San Francisco",
    lng: -122.4194,
    lat: 37.7749,
    type: "secondary",
    shipments: 789,
    region: "west",
  },
  {
    id: "msp",
    city: "Minneapolis",
    lng: -93.2219,
    lat: 44.8848,
    type: "secondary",
    shipments: 423,
    region: "midwest",
  },
  {
    id: "dtw",
    city: "Detroit",
    lng: -83.0458,
    lat: 42.2162,
    type: "secondary",
    shipments: 456,
    region: "midwest",
  },
  {
    id: "slc",
    city: "Salt Lake City",
    lng: -111.978,
    lat: 40.758,
    type: "secondary",
    shipments: 342,
    region: "west",
  },
];

export const routes: Route[] = [
  { from: "ord", to: "lax", mode: "air", shipments: 234, status: "active" },
  { from: "ord", to: "jfk", mode: "ground", shipments: 312, status: "active" },
  { from: "ord", to: "dfw", mode: "air", shipments: 189, status: "active" },
  { from: "ord", to: "atl", mode: "air", shipments: 213, status: "active" },
  { from: "ord", to: "den", mode: "ground", shipments: 156, status: "active" },
  { from: "ord", to: "msp", mode: "ground", shipments: 198, status: "active" },
  { from: "ord", to: "dtw", mode: "ground", shipments: 167, status: "delayed" },
  { from: "lax", to: "sfo", mode: "ground", shipments: 245, status: "active" },
  { from: "lax", to: "sea", mode: "air", shipments: 178, status: "active" },
  { from: "lax", to: "den", mode: "air", shipments: 198, status: "active" },
  { from: "lax", to: "phx", mode: "ground", shipments: 212, status: "active" },
  { from: "lax", to: "dfw", mode: "air", shipments: 223, status: "active" },
  { from: "jfk", to: "atl", mode: "air", shipments: 267, status: "active" },
  { from: "jfk", to: "mia", mode: "air", shipments: 234, status: "active" },
  { from: "jfk", to: "bos", mode: "ground", shipments: 189, status: "active" },
  { from: "jfk", to: "ord", mode: "air", shipments: 278, status: "active" },
  { from: "dfw", to: "atl", mode: "air", shipments: 198, status: "active" },
  { from: "dfw", to: "iah", mode: "ground", shipments: 245, status: "active" },
  { from: "dfw", to: "den", mode: "air", shipments: 167, status: "active" },
  { from: "dfw", to: "phx", mode: "ground", shipments: 156, status: "delayed" },
  { from: "atl", to: "mia", mode: "ground", shipments: 234, status: "active" },
  { from: "atl", to: "iah", mode: "air", shipments: 189, status: "active" },
  { from: "den", to: "sea", mode: "air", shipments: 178, status: "active" },
  { from: "den", to: "slc", mode: "ground", shipments: 198, status: "active" },
  { from: "den", to: "phx", mode: "air", shipments: 167, status: "active" },
  { from: "sea", to: "sfo", mode: "air", shipments: 212, status: "active" },
  { from: "sfo", to: "phx", mode: "air", shipments: 156, status: "active" },
  { from: "mia", to: "iah", mode: "air", shipments: 198, status: "active" },
  { from: "msp", to: "ord", mode: "ground", shipments: 189, status: "active" },
  { from: "msp", to: "den", mode: "air", shipments: 145, status: "active" },
  { from: "dtw", to: "ord", mode: "ground", shipments: 167, status: "active" },
  { from: "dtw", to: "jfk", mode: "air", shipments: 178, status: "active" },
  { from: "bos", to: "jfk", mode: "ground", shipments: 156, status: "active" },
  { from: "slc", to: "den", mode: "ground", shipments: 134, status: "active" },
  { from: "slc", to: "phx", mode: "air", shipments: 123, status: "delayed" },
  { from: "ord", to: "sfo", mode: "air", shipments: 198, status: "active" },
  { from: "ord", to: "mia", mode: "air", shipments: 245, status: "active" },
  { from: "lax", to: "atl", mode: "air", shipments: 289, status: "active" },
  { from: "jfk", to: "dfw", mode: "air", shipments: 234, status: "active" },
  { from: "atl", to: "ord", mode: "air", shipments: 267, status: "active" },
  { from: "sfo", to: "den", mode: "air", shipments: 189, status: "active" },
];

export const modeConfig = {
  air: { color: "#3b82f6", label: "Air" },
  ground: { color: "#22c55e", label: "Ground" },
} as const;

export const statusConfig = {
  active: { color: "#10b981", label: "Active" },
  delayed: { color: "#f59e0b", label: "Delayed" },
} as const;

export const regionLabels: Record<Hub["region"], string> = {
  west: "West",
  midwest: "Midwest",
  south: "South",
  northeast: "Northeast",
};

export type Filter = Route["mode"] | Route["status"] | Hub["region"];

export const networkBounds: [[number, number], [number, number]] = [
  [Math.min(...hubs.map((h) => h.lng)), Math.min(...hubs.map((h) => h.lat))],
  [Math.max(...hubs.map((h) => h.lng)), Math.max(...hubs.map((h) => h.lat))],
];
