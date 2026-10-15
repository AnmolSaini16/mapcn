"use client";

import {
  Map,
  MapArc,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/registry/map";
import { ExampleCard } from "./example-card";

const hub = { name: "London", lng: -0.1276, lat: 51.5074 };

const destinations = [
  { name: "New York", lng: -74.006, lat: 40.7128 },
  { name: "São Paulo", lng: -46.6333, lat: -23.5505 },
  { name: "Cape Town", lng: 18.4241, lat: -33.9249 },
  { name: "Mumbai", lng: 72.8777, lat: 19.076 },
  { name: "Tokyo", lng: 139.6917, lat: 35.6895 },
];

const arcs = destinations.map((dest) => ({
  id: dest.name,
  from: [hub.lng, hub.lat] as [number, number],
  to: [dest.lng, dest.lat] as [number, number],
}));

export function ArcExample() {
  return (
    <ExampleCard className="aspect-square">
      <Map
        attributionControl={false}
        center={[-0.1276, 41.5074]}
        zoom={1}
        projection={{ type: "globe" }}
        scrollZoom={false}
      >
        <MapArc
          data={arcs}
          paint={{
            "line-color": "#3b82f6",
            "line-opacity": 0.9,
            "line-dasharray": [2, 2],
          }}
          interactive={false}
        />

        <MapMarker longitude={hub.lng} latitude={hub.lat}>
          <MarkerContent>
            <div className="size-3 rounded-full border-2 border-white bg-blue-500" />
            <MarkerLabel position="top">{hub.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {destinations.map((dest) => (
          <MapMarker key={dest.name} longitude={dest.lng} latitude={dest.lat}>
            <MarkerContent>
              <div className="size-2 rounded-full border-2 border-white bg-blue-500" />
              <MarkerLabel position="top">{dest.name}</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>
    </ExampleCard>
  );
}
