export type EdgeStatus = "operational" | "degraded" | "down";

export interface EdgeNode {
  id: string;
  city: string;
  region: string;
  lng: number;
  lat: number;
  status: EdgeStatus;
  latency: number;
  uptime: number;
}

export const statusMeta: Record<EdgeStatus, { dot: string; text: string }> = {
  operational: {
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  degraded: {
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  down: {
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
};

/** Country borders served from a public CDN - swap in your own GeoJSON. */
export const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

export const mapView = {
  center: [5, 28] as [number, number],
  zoom: 0.45,
  minZoom: 0.45,
  maxZoom: 2,
};

/** Edge network points of presence. */
export const edgeNodes: EdgeNode[] = [
  {
    id: "iad",
    city: "Washington, D.C.",
    region: "North America",
    lng: -77.0369,
    lat: 38.9072,
    status: "operational",
    latency: 24,
    uptime: 99.99,
  },
  {
    id: "sfo",
    city: "San Francisco",
    region: "North America",
    lng: -122.4194,
    lat: 37.7749,
    status: "operational",
    latency: 31,
    uptime: 99.98,
  },
  {
    id: "yyz",
    city: "Toronto",
    region: "North America",
    lng: -79.3832,
    lat: 43.6532,
    status: "degraded",
    latency: 88,
    uptime: 99.21,
  },
  {
    id: "gru",
    city: "São Paulo",
    region: "South America",
    lng: -46.6333,
    lat: -23.5505,
    status: "operational",
    latency: 47,
    uptime: 99.95,
  },
  {
    id: "lhr",
    city: "London",
    region: "Europe",
    lng: -0.1276,
    lat: 51.5074,
    status: "operational",
    latency: 19,
    uptime: 99.99,
  },
  {
    id: "fra",
    city: "Frankfurt",
    region: "Europe",
    lng: 8.6821,
    lat: 50.1109,
    status: "operational",
    latency: 22,
    uptime: 99.97,
  },
  {
    id: "cdg",
    city: "Paris",
    region: "Europe",
    lng: 2.3522,
    lat: 48.8566,
    status: "down",
    latency: 0,
    uptime: 97.84,
  },
  {
    id: "jnb",
    city: "Johannesburg",
    region: "Africa",
    lng: 28.0473,
    lat: -26.2041,
    status: "operational",
    latency: 64,
    uptime: 99.92,
  },
  {
    id: "bom",
    city: "Mumbai",
    region: "Asia Pacific",
    lng: 72.8777,
    lat: 19.076,
    status: "operational",
    latency: 41,
    uptime: 99.96,
  },
  {
    id: "sin",
    city: "Singapore",
    region: "Asia Pacific",
    lng: 103.8198,
    lat: 1.3521,
    status: "degraded",
    latency: 73,
    uptime: 99.45,
  },
  {
    id: "nrt",
    city: "Tokyo",
    region: "Asia Pacific",
    lng: 139.6917,
    lat: 35.6895,
    status: "operational",
    latency: 28,
    uptime: 99.98,
  },
  {
    id: "syd",
    city: "Sydney",
    region: "Asia Pacific",
    lng: 151.2093,
    lat: -33.8688,
    status: "operational",
    latency: 52,
    uptime: 99.94,
  },
  {
    id: "lax",
    city: "Los Angeles",
    region: "North America",
    lng: -118.2437,
    lat: 34.0522,
    status: "operational",
    latency: 33,
    uptime: 99.97,
  },
  {
    id: "ord",
    city: "Chicago",
    region: "North America",
    lng: -87.6298,
    lat: 41.8781,
    status: "operational",
    latency: 27,
    uptime: 99.98,
  },
  {
    id: "scl",
    city: "Santiago",
    region: "South America",
    lng: -70.6693,
    lat: -33.4489,
    status: "operational",
    latency: 58,
    uptime: 99.91,
  },
  {
    id: "ams",
    city: "Amsterdam",
    region: "Europe",
    lng: 4.9041,
    lat: 52.3676,
    status: "operational",
    latency: 21,
    uptime: 99.98,
  },
  {
    id: "mad",
    city: "Madrid",
    region: "Europe",
    lng: -3.7038,
    lat: 40.4168,
    status: "degraded",
    latency: 79,
    uptime: 99.32,
  },
  {
    id: "arn",
    city: "Stockholm",
    region: "Europe",
    lng: 18.0686,
    lat: 59.3293,
    status: "operational",
    latency: 26,
    uptime: 99.96,
  },
  {
    id: "dxb",
    city: "Dubai",
    region: "Middle East",
    lng: 55.2708,
    lat: 25.2048,
    status: "operational",
    latency: 44,
    uptime: 99.95,
  },
  {
    id: "hkg",
    city: "Hong Kong",
    region: "Asia Pacific",
    lng: 114.1694,
    lat: 22.3193,
    status: "operational",
    latency: 36,
    uptime: 99.97,
  },
  {
    id: "icn",
    city: "Seoul",
    region: "Asia Pacific",
    lng: 126.978,
    lat: 37.5665,
    status: "operational",
    latency: 30,
    uptime: 99.98,
  },
  {
    id: "los",
    city: "Lagos",
    region: "Africa",
    lng: 3.3792,
    lat: 6.5244,
    status: "down",
    latency: 0,
    uptime: 98.12,
  },
];

export interface NetworkSummary {
  status: EdgeStatus;
  label: string;
  operational: number;
  total: number;
  avgUptime: number;
}

/** Derive the overall network health from the individual edge nodes. */
export function getNetworkSummary(nodes: EdgeNode[]): NetworkSummary {
  const total = nodes.length;
  const operational = nodes.filter((n) => n.status === "operational").length;
  const hasDown = nodes.some((n) => n.status === "down");
  const hasDegraded = nodes.some((n) => n.status === "degraded");

  const status: EdgeStatus = hasDown
    ? "down"
    : hasDegraded
      ? "degraded"
      : "operational";

  const label = hasDown
    ? "Partial outage"
    : hasDegraded
      ? "Degraded performance"
      : "All systems operational";

  const avgUptime =
    nodes.reduce((sum, n) => sum + n.uptime, 0) / Math.max(total, 1);

  return { status, label, operational, total, avgUptime };
}
