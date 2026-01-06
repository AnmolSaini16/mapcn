"use client";

import { useState } from "react";
import { Map, MapGeoJSON, MapPopup, MapControls } from "@/registry/map";

const exampleGeoJSON = `{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [13.4050, 52.5200]
  },
  "properties": {
    "name": "Berlin"
  }
}`;

const exampleFeatureCollection = `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [13.4050, 52.5200]
      },
      "properties": {
        "name": "Berlin"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [2.3522, 48.8566]
      },
      "properties": {
        "name": "Paris"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [13.4050, 52.5200],
          [2.3522, 48.8566]
        ]
      },
      "properties": {
        "name": "Route"
      }
    }
  ]
}`;

export function GeoJSONExample() {
  const [selectedFeature, setSelectedFeature] = useState<{
    coordinates: [number, number];
    properties: Record<string, unknown>;
  } | null>(null);

  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full">
        <Map center={[8.0, 50.5]} zoom={5} fadeDuration={0}>
          <MapGeoJSON
            data={exampleFeatureCollection}
            pointStyle={{
              color: "#ef4444",
              radius: 8,
            }}
            lineStyle={{
              color: "#3b82f6",
              width: 4,
            }}
            onClick={(feature, coordinates) => {
              setSelectedFeature({
                coordinates,
                properties: feature.properties || {},
              });
            }}
          />

          {selectedFeature && (
            <MapPopup
              key={`${selectedFeature.coordinates[0]}-${selectedFeature.coordinates[1]}`}
              longitude={selectedFeature.coordinates[0]}
              latitude={selectedFeature.coordinates[1]}
              onClose={() => setSelectedFeature(null)}
              closeOnClick={false}
              focusAfterOpen={false}
              closeButton
            >
              <div className="space-y-1 p-1">
                {Object.entries(selectedFeature.properties).map(
                  ([key, value]) => (
                    <p key={key} className="text-sm">
                      <strong>{key}:</strong> {String(value)}
                    </p>
                  )
                )}
              </div>
            </MapPopup>
          )}

          <MapControls />
        </Map>
      </div>

      <div className="rounded-md border bg-muted p-4">
        <h3 className="mb-2 text-sm font-semibold">Example GeoJSON String:</h3>
        <pre className="overflow-x-auto text-xs">
          <code>{exampleGeoJSON}</code>
        </pre>
      </div>
    </div>
  );
}

