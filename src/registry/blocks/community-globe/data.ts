export interface Member {
  id: string;
  name: string;
  city: string;
  lng: number;
  lat: number;
  localTime: string;
  awake: boolean;
}

export interface MemberGroup {
  lng: number;
  lat: number;
  members: Member[];
}

/** Country shapes served from a public CDN — swap in your own GeoJSON. */
export const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

export const mapView = {
  center: [18, 24] as [number, number],
  zoom: 2.2,
  minZoom: 2,
  maxZoom: 4,
};

/** Sample avatars from a public API — swap in your own member images. */
export function getAvatarUrl(id: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(id)}&backgroundColor=e4e4e7`;
}

/** Hardcoded sample members — replace with data from your API. */
export const members: Member[] = [
  {
    id: "m01",
    name: "Maya Okafor",
    city: "Lagos",
    lng: 3.38,
    lat: 6.52,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m02",
    name: "Tomás Rivera",
    city: "Madrid",
    lng: -3.7,
    lat: 40.42,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m03",
    name: "Elin Berg",
    city: "Stockholm",
    lng: 18.07,
    lat: 59.33,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m04",
    name: "Noah Fischer",
    city: "Berlin",
    lng: 13.4,
    lat: 52.52,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m05",
    name: "Chloé Martin",
    city: "Paris",
    lng: 2.35,
    lat: 48.86,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m06",
    name: "Oliver Hart",
    city: "London",
    lng: -0.13,
    lat: 51.51,
    localTime: "10:20",
    awake: true,
  },
  {
    id: "m07",
    name: "Giulia Conti",
    city: "Rome",
    lng: 12.5,
    lat: 41.9,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m08",
    name: "Sofia Petrova",
    city: "Sofia",
    lng: 23.32,
    lat: 42.7,
    localTime: "12:20",
    awake: true,
  },
  {
    id: "m09",
    name: "Marta Nowak",
    city: "Warsaw",
    lng: 21.01,
    lat: 52.23,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m10",
    name: "Emre Kaya",
    city: "Istanbul",
    lng: 28.98,
    lat: 41.01,
    localTime: "13:20",
    awake: true,
  },
  {
    id: "m11",
    name: "Layla Hassan",
    city: "Cairo",
    lng: 31.24,
    lat: 30.04,
    localTime: "12:20",
    awake: true,
  },
  {
    id: "m12",
    name: "Omar Haddad",
    city: "Dubai",
    lng: 55.27,
    lat: 25.2,
    localTime: "14:20",
    awake: true,
  },
  {
    id: "m13",
    name: "Wanjiru Mwangi",
    city: "Nairobi",
    lng: 36.82,
    lat: -1.29,
    localTime: "13:20",
    awake: true,
  },
  {
    id: "m14",
    name: "Thabo Dlamini",
    city: "Johannesburg",
    lng: 28.05,
    lat: -26.2,
    localTime: "12:20",
    awake: true,
  },
  {
    id: "m15",
    name: "Aisha Benali",
    city: "Casablanca",
    lng: -7.59,
    lat: 33.57,
    localTime: "11:20",
    awake: true,
  },
  {
    id: "m16",
    name: "Arjun Mehta",
    city: "Mumbai",
    lng: 72.88,
    lat: 19.08,
    localTime: "15:50",
    awake: true,
  },
  {
    id: "m17",
    name: "Priya Nair",
    city: "Bengaluru",
    lng: 77.59,
    lat: 12.97,
    localTime: "15:50",
    awake: true,
  },
  {
    id: "m18",
    name: "Rohan Gill",
    city: "Delhi",
    lng: 77.21,
    lat: 28.61,
    localTime: "15:50",
    awake: true,
  },
  {
    id: "m19",
    name: "Linh Tran",
    city: "Hanoi",
    lng: 105.85,
    lat: 21.03,
    localTime: "17:20",
    awake: true,
  },
  {
    id: "m20",
    name: "Wei Chen",
    city: "Shanghai",
    lng: 121.47,
    lat: 31.23,
    localTime: "18:20",
    awake: true,
  },
  {
    id: "m21",
    name: "Yuki Tanaka",
    city: "Tokyo",
    lng: 139.69,
    lat: 35.68,
    localTime: "19:20",
    awake: true,
  },
  {
    id: "m22",
    name: "Isla Walker",
    city: "Sydney",
    lng: 151.21,
    lat: -33.87,
    localTime: "21:20",
    awake: true,
  },
  {
    id: "m23",
    name: "Ethan Brooks",
    city: "New York",
    lng: -74.01,
    lat: 40.71,
    localTime: "06:20",
    awake: false,
  },
  {
    id: "m24",
    name: "Camille Roy",
    city: "Montréal",
    lng: -73.57,
    lat: 45.5,
    localTime: "06:20",
    awake: false,
  },
  {
    id: "m25",
    name: "Jordan Lee",
    city: "San Francisco",
    lng: -122.42,
    lat: 37.77,
    localTime: "03:20",
    awake: false,
  },
  {
    id: "m26",
    name: "Valeria Cruz",
    city: "Mexico City",
    lng: -99.13,
    lat: 19.43,
    localTime: "04:20",
    awake: false,
  },
  {
    id: "m27",
    name: "Bruno Costa",
    city: "São Paulo",
    lng: -46.63,
    lat: -23.55,
    localTime: "07:20",
    awake: true,
  },
  {
    id: "m28",
    name: "Lucía Paz",
    city: "Buenos Aires",
    lng: -58.38,
    lat: -34.6,
    localTime: "07:20",
    awake: true,
  },
];
