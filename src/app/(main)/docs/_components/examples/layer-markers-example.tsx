"use client";

import { useEffect, useState, useId } from "react";
import type { MapMouseEvent, MapGeoJSONFeature } from "maplibre-gl";
import { Map, MapPopup, useMap } from "@/registry/map";

// Generate random points around NYC
function generateRandomPoints(count: number) {
  const center = { lng: -73.98, lat: 40.75 };
  const features = [];

  for (let i = 0; i < count; i++) {
    const lng = center.lng + (Math.random() - 0.5) * 0.15;
    const lat = center.lat + (Math.random() - 0.5) * 0.1;
    features.push({
      type: "Feature" as const,
      properties: {
        id: i,
        name: `Location ${i + 1}`,
        category: ["Restaurant", "Cafe", "Bar", "Shop"][
          Math.floor(Math.random() * 4)
        ],
      },
      geometry: {
        type: "Point" as const,
        coordinates: [lng, lat],
      },
    });
  }

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

// 200 markers - would be slow with DOM markers, but fast with layers
const pointsData = generateRandomPoints(200);

interface SelectedPoint {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
}

function MarkersLayer() {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `markers-source-${id}`;
  const layerId = `markers-layer-${id}`;
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(
    null,
  );

  useEffect(() => {
    if (!map || !isLoaded) return;

    map.addSource(sourceId, {
      type: "geojson",
      data: pointsData,
    });

    map.addLayer({
      id: layerId,
      type: "circle",
      source: sourceId,
      paint: {
        "circle-radius": 6,
        "circle-color": "#3b82f6",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
        // add more paint properties here to customize the appearance of the markers
      },
    });

    const handleClick = (
      e: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      if (!e.features?.length) return;

      const feature = e.features[0];
      const coords = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      setSelectedPoint({
        id: feature.properties?.id,
        name: feature.properties?.name,
        category: feature.properties?.category,
        coordinates: coords,
      });
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", layerId, handleClick);
    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    return () => {
      map.off("click", layerId, handleClick);
      map.off("mouseenter", layerId, handleMouseEnter);
      map.off("mouseleave", layerId, handleMouseLeave);

      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore cleanup errors
      }
    };
  }, [map, isLoaded, sourceId, layerId]);

  return (
    <>
      {selectedPoint && (
        <MapPopup
          longitude={selectedPoint.coordinates[0]}
          latitude={selectedPoint.coordinates[1]}
          onClose={() => setSelectedPoint(null)}
          closeOnClick={false}
          focusAfterOpen={false}
          offset={10}
          closeButton
        >
          <div className="min-w-24">
            <p className="font-medium">{selectedPoint.name}</p>
            <p className="text-muted-foreground text-sm">
              {selectedPoint.category}
            </p>
          </div>
        </MapPopup>
      )}
    </>
  );
}

export function LayerMarkersExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[-73.98, 40.75]} zoom={11}>
        <MarkersLayer />
      </Map>
    </div>
  );
}
