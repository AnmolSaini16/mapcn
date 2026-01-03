export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: "metric" | "imperial" = "metric"
): number {
    const R = unit === "metric" ? 6371 : 3959; // Radius of the earth in km or miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km or miles
    return Number(d.toFixed(1));
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export function calculateMidpoint(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): { lat: number; lng: number } {
    return {
        lat: (lat1 + lat2) / 2,
        lng: (lon1 + lon2) / 2,
    };
}
