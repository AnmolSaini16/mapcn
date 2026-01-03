"use client";

import { useState } from "react";
import { type MapMarkerProps, Map, MarkerContent, MapMarker } from "@/registry/map";
import { ProximityMap, type ProximityPoint } from "@/registry/proximity-map";

const INITIAL_POINTS: ProximityPoint[] = [
    { lat: 40.785091, lng: -73.968285, label: "Central Park" },
    { lat: 40.7484, lng: -73.9857, label: "Empire State" },
    { lat: 40.7580, lng: -73.9855, label: "Times Square" },
    { lat: 40.7527, lng: -73.9772, label: "Grand Central" },
    { lat: 40.7128, lng: -74.0060, label: "City Hall" },
];

export function ProximityMapExample() {
    return (
        <div className="relative w-full h-[400px] border rounded-lg overflow-hidden font-sans">
            <Map
                center={[-73.985, 40.758]}
                zoom={11.5}
                styles={{
                    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                }}
            >
                <ProximityMap points={INITIAL_POINTS} labels="hover" />
            </Map>

            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 p-3 bg-background/90 backdrop-blur rounded-lg border shadow-sm text-sm">
                <h3 className="font-semibold mb-1">Manhattan Landmarks</h3>
                <p className="text-muted-foreground text-[10px] max-w-[150px]">
                    Distance mesh between 5 key locations.
                </p>
            </div>
        </div>
    );
}
