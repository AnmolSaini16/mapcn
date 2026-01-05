"use client";

import { useState } from "react";
import { Map, MapClusterLayer, MapPopup, MapControls } from "@/registry/map";

interface EarthquakeProperties {
  mag: number;
  place: string;
  tsunami: number;
}

export default function ClusterExample() {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: EarthquakeProperties;
  } | null>(null);

  return (
    <div className="h-[400px] w-full">
      <Map center={[-103.59, 40.66]} zoom={3.4} fadeDuration={0}>
        <MapClusterLayer<EarthquakeProperties>
          data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
          clusterRadius={50}
          clusterMaxZoom={14}
          clusterColors={["#22c55e", "#eab308", "#ef4444"]}
          pointColor="#3b82f6"
          onPointClick={(feature, coordinates) => {
            setSelectedPoint({
              coordinates,
              properties: feature.properties,
            });
          }}
        />

        {selectedPoint && (
          <MapPopup
            key={`${selectedPoint.coordinates[0]}-${selectedPoint.coordinates[1]}`}
            longitude={selectedPoint.coordinates[0]}
            latitude={selectedPoint.coordinates[1]}
            onClose={() => setSelectedPoint(null)}
            closeOnClick={false}
            focusAfterOpen={false}
            closeButton
          >
            <div className="space-y-1 p-1">
              <p className="text-sm">
                Magnitude: {selectedPoint.properties.mag}
              </p>
              <p className="text-sm">
                Tsunami:{" "}
                {selectedPoint.properties?.tsunami === 1 ? "Yes" : "No"}
              </p>
            </div>
          </MapPopup>
        )}

        <MapControls />
      </Map>
    </div>
  );
}
