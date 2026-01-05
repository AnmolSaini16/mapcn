"use client";

import { Button } from "@/components/ui/button";
import { Map, MapControls, useMap } from "@/registry/map-gl";
import { Layers, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl/maplibre";

const geojsonData = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Central Park", type: "park" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-73.9731, 40.7644],
            [-73.9819, 40.7681],
            [-73.958, 40.8006],
            [-73.9493, 40.7969],
            [-73.9731, 40.7644],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bryant Park", type: "park" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-73.9837, 40.7536],
            [-73.9854, 40.7542],
            [-73.984, 40.7559],
            [-73.9823, 40.7553],
            [-73.9837, 40.7536],
          ],
        ],
      },
    },
  ],
};

function CustomLayer() {
  const { mapRef } = useMap();
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [hoveredPark, setHoveredPark] = useState<string | null>(null);

  const parksSourceId = "parks";
  const parksFillLayerId = "parks-fill";
  const parksOutlineLayerId = "parks-outline";

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    // Hover effect
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredPark(null);
    };

    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [parksFillLayerId],
      });
      if (features.length > 0) {
        setHoveredPark(features[0].properties?.name || null);
      }
    };

    map.on("mouseenter", parksFillLayerId, handleMouseEnter);
    map.on("mouseleave", parksFillLayerId, handleMouseLeave);
    map.on("mousemove", parksFillLayerId, handleMouseMove);

    return () => {
      map.off("mouseenter", parksFillLayerId, handleMouseEnter);
      map.off("mouseleave", parksFillLayerId, handleMouseLeave);
      map.off("mousemove", parksFillLayerId, handleMouseMove);
    };
  }, [mapRef]);

  const toggleLayer = () =>
    setIsLayerVisible((prevIsLayerVisible) => !prevIsLayerVisible);

  return (
    <>
      <Source id={parksSourceId} type="geojson" data={geojsonData}>
        <Layer
          id={parksFillLayerId}
          type="fill"
          paint={{
            "fill-color": "#22c55e",
            "fill-opacity": 0.4,
          }}
          layout={{
            visibility: isLayerVisible ? "visible" : "none",
          }}
        />
        <Layer
          id={parksOutlineLayerId}
          type="line"
          paint={{
            "line-color": "#16a34a",
            "line-width": 2,
          }}
          layout={{
            visibility: isLayerVisible ? "visible" : "none",
          }}
        />
      </Source>
      <div className="absolute top-3 left-3 z-10">
        <Button
          size="sm"
          variant={isLayerVisible ? "default" : "secondary"}
          onClick={toggleLayer}
        >
          {isLayerVisible ? (
            <X className="size-4 mr-1.5" />
          ) : (
            <Layers className="size-4 mr-1.5" />
          )}
          {isLayerVisible ? "Hide Parks" : "Show Parks"}
        </Button>
      </div>

      {hoveredPark && (
        <div className="absolute bottom-3 left-3 z-10 rounded-md bg-background/90 backdrop-blur px-3 py-2 text-sm font-medium border">
          {hoveredPark}
        </div>
      )}
    </>
  );
}

export function CustomLayerExample() {
  return (
    <div className="h-[400px] w-full">
      <Map
        initialViewState={{ longitude: -73.97, latitude: 40.78, zoom: 11.8 }}
      >
        <MapControls />
        <CustomLayer />
      </Map>
    </div>
  );
}
