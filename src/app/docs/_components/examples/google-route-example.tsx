"use client";

import { Map, MapMarker, MarkerContent, MarkerLabel } from "@/registry/map";
import { GoogleMapRoute } from "@/registry/google-map-route";

const start = { name: "Empire State Building", lat: 40.7484, lng: -73.9857 };
const end = { name: "Central Park", lat: 40.7829, lng: -73.9654 };

export function GoogleRouteExample() {
    return (
        <div className="h-[400px] w-full relative rounded-lg overflow-hidden border group">
            <Map center={[-73.975, 40.765]} zoom={12}>
                <GoogleMapRoute
                    origin={start}
                    destination={end}
                    mode="driving"
                    color="#EA4335" // Google Red
                    width={5}
                    tooltip
                />

                <MapMarker longitude={start.lng} latitude={start.lat}>
                    <MarkerContent>
                        <div className="size-4 rounded-full bg-red-600 border-2 border-white shadow-lg" />
                        <MarkerLabel position="bottom">Origin</MarkerLabel>
                    </MarkerContent>
                </MapMarker>

                <MapMarker longitude={end.lng} latitude={end.lat}>
                    <MarkerContent>
                        <div className="size-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                        <MarkerLabel position="bottom">Destination</MarkerLabel>
                    </MarkerContent>
                </MapMarker>
            </Map>
        </div>
    );
}
