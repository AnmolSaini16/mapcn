export type LocationPoint = {
  city: string;
  lng: number;
  lat: number;
  size: number;
};

export type BreakdownRow = {
  label: string;
  value: number;
};

export const locations: LocationPoint[] = [
  { city: "San Francisco", lng: -122.4194, lat: 37.7749, size: 16 },
  { city: "New York", lng: -74.006, lat: 40.7128, size: 15 },
  { city: "Toronto", lng: -79.3832, lat: 43.6532, size: 11 },
  { city: "Mexico City", lng: -99.1332, lat: 19.4326, size: 10 },
  { city: "Sao Paulo", lng: -46.6333, lat: -23.5505, size: 12 },
  { city: "Buenos Aires", lng: -58.3816, lat: -34.6037, size: 9 },
  { city: "London", lng: -0.1276, lat: 51.5074, size: 14 },
  { city: "Berlin", lng: 13.405, lat: 52.52, size: 11 },
  { city: "Paris", lng: 2.3522, lat: 48.8566, size: 13 },
  { city: "Madrid", lng: -3.7038, lat: 40.4168, size: 10 },
  { city: "Cairo", lng: 31.2357, lat: 30.0444, size: 9 },
  { city: "Lagos", lng: 3.3792, lat: 6.5244, size: 10 },
  { city: "Mumbai", lng: 72.8777, lat: 19.076, size: 13 },
  { city: "Dubai", lng: 55.2708, lat: 25.2048, size: 11 },
  { city: "Seoul", lng: 126.978, lat: 37.5665, size: 12 },
  { city: "Singapore", lng: 103.8198, lat: 1.3521, size: 10 },
  { city: "Tokyo", lng: 139.6917, lat: 35.6895, size: 12 },
  { city: "Sydney", lng: 151.2093, lat: -33.8688, size: 9 },
  { city: "Auckland", lng: 174.7633, lat: -36.8485, size: 8 },
];

export const usersPerDay = [
  { day: "1", users: 420 },
  { day: "2", users: 468 },
  { day: "3", users: 512 },
  { day: "4", users: 390 },
  { day: "5", users: 540 },
  { day: "6", users: 305 },
  { day: "7", users: 268 },
  { day: "8", users: 498 },
  { day: "9", users: 610 },
  { day: "10", users: 472 },
  { day: "11", users: 845 },
  { day: "12", users: 690 },
  { day: "13", users: 360 },
  { day: "14", users: 322 },
  { day: "15", users: 588 },
  { day: "16", users: 654 },
  { day: "17", users: 720 },
  { day: "18", users: 505 },
  { day: "19", users: 932 },
  { day: "20", users: 410 },
  { day: "21", users: 372 },
  { day: "22", users: 640 },
  { day: "23", users: 712 },
  { day: "24", users: 598 },
  { day: "25", users: 1040 },
  { day: "26", users: 805 },
  { day: "27", users: 445 },
  { day: "28", users: 398 },
  { day: "29", users: 702 },
  { day: "30", users: 868 },
];

export const deviceCategoryData = [
  { name: "Desktop", value: 73.3, fill: "#d4d4d4" },
  { name: "Mobile", value: 25.0, fill: "#737373" },
  { name: "Tablet", value: 1.7, fill: "#525252" },
];

export const visitedPagesRows: BreakdownRow[] = [
  { label: "Home", value: 31 },
  { label: "Pricing", value: 23 },
  { label: "Docs / Basic Map", value: 18 },
  { label: "Installation", value: 12 },
  { label: "Components", value: 9 },
  { label: "Blog", value: 6 },
];

export const countriesRows: BreakdownRow[] = [
  { label: "United States", value: 27 },
  { label: "India", value: 14 },
  { label: "United Kingdom", value: 8 },
  { label: "Germany", value: 6 },
  { label: "Japan", value: 4 },
  { label: "Australia", value: 2 },
];

export const referrersRows: BreakdownRow[] = [
  { label: "google", value: 38 },
  { label: "direct", value: 26 },
  { label: "github.com", value: 19 },
  { label: "x.com", value: 11 },
  { label: "ui.shadcn.com", value: 8 },
  { label: "other", value: 5 },
];

export const browsersRows: BreakdownRow[] = [
  { label: "Chrome", value: 52 },
  { label: "Safari", value: 21 },
  { label: "Firefox", value: 14 },
  { label: "Edge", value: 8 },
  { label: "Other", value: 5 },
];
