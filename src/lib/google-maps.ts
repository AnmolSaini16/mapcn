/**
 * Decodes an encoded polyline string from Google Maps Direction API into an array of coordinates.
 * Algorithm: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
"use server";

export async function decodePolyline(encoded: string): Promise<[number, number][]> {
    const poly: [number, number][] = [];
    let index = 0,
        len = encoded.length;
    let lat = 0,
        lng = 0;

    while (index < len) {
        let b,
            shift = 0,
            result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = result & 1 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = result & 1 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        poly.push([lng * 1e-5, lat * 1e-5]);
    }

    return poly;
}

export interface GoogleRouteOptions {
    origin: string | { lat: number; lng: number };
    destination: string | { lat: number; lng: number };
    mode?: "driving" | "walking" | "bicycling" | "transit";
    units?: "metric" | "imperial";
}
export interface GoogleRouteLeg {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_address: string;
    end_address: string;
}

export interface GoogleRouteResult {
    path: [number, number][];
    leg: GoogleRouteLeg;
}
export async function fetchGoogleRoute({
    origin,
    destination,
    mode = "driving",
    units = "metric",
}: GoogleRouteOptions): Promise<GoogleRouteResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GOOGLE_MAPS_API_KEY environment variable");
    }

    const originStr =
        typeof origin === "string" ? origin : `${origin.lat},${origin.lng}`;
    const destStr =
        typeof destination === "string"
            ? destination
            : `${destination.lat},${destination.lng}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        originStr
    )}&destination=${encodeURIComponent(destStr)}&mode=${mode}&units=${units}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
        throw new Error(data.error_message || "Failed to fetch route");
    }

    if (data.routes.length === 0) {
        throw new Error("No routes found");
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    // Google Directions API returns an encoded polyline in `overview_polyline.points`
    return {
        path: await decodePolyline(route.overview_polyline.points),
        leg: {
            distance: leg.distance,
            duration: leg.duration,
            start_address: leg.start_address,
            end_address: leg.end_address,
        },
    };
}
