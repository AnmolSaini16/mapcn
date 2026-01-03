"use client";

import { Map } from "@/registry/map";
import { GoogleProximityMap, type GoogleProximityPoint } from "@/registry/google-proximity-map";

const POINTS: GoogleProximityPoint[] = [
    { lat: 40.748817, lng: -73.985428, label: "Empire State" },
    { lat: 40.7580, lng: -73.9855, label: "Times Sq" },
    { lat: 40.7527, lng: -73.9772, label: "Grand Central" },
    { lat: 40.7420, lng: -74.0048, label: "Chelsea Mkt" },
    { lat: 40.7127, lng: -74.0134, label: "WTC" },
];

export function GoogleProximityMapExample() {
    return (
        <div className="relative w-full h-[500px] border rounded-lg overflow-hidden font-sans">
            <Map
                center={[-73.96, 40.73]}
                zoom={11.5}
                styles={{
                    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                }}
            >
                <GoogleProximityMap
                    points={POINTS}
                    mode="driving"
                    unit="imperial"
                    labels="hover"
                />
            </Map>

            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 p-3 bg-background/90 backdrop-blur rounded-lg border shadow-sm text-sm">
                <h3 className="font-semibold mb-1">Live Route Mesh</h3>
                <p className="text-muted-foreground text-[10px] max-w-[150px]">
                    Driving routes via Google Maps. Hover for details.
                </p>
            </div>
        </div>
    );
}
