"use client";

import { useEffect, useState } from "react";
import { Map, useMap } from "@/registry/map-gl";
import { Button } from "@/components/ui/button";
import { RotateCcw, Mountain } from "lucide-react";

function MapController() {
  const { mapRef, isLoaded } = useMap();
  const [pitch, setPitch] = useState(0);
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const handleMove = () => {
      setPitch(Math.round(map.getPitch()));
      setBearing(Math.round(map.getBearing()));
    };

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
    };
  }, [mapRef]);

  const handle3DView = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.easeTo({
      pitch: 60,
      bearing: -20,
      duration: 1000,
    });
  };

  const handleReset = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.easeTo({
      pitch: 0,
      bearing: 0,
      duration: 1000,
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={handle3DView}>
          <Mountain className="size-4 mr-1.5" />
          3D View
        </Button>
        <Button size="sm" variant="secondary" onClick={handleReset}>
          <RotateCcw className="size-4 mr-1.5" />
          Reset
        </Button>
      </div>
      <div className="rounded-md bg-background/90 backdrop-blur px-3 py-2 text-xs font-mono border">
        <div>Pitch: {pitch}°</div>
        <div>Bearing: {bearing}°</div>
      </div>
    </div>
  );
}

export function AdvancedUsageExample() {
  return (
    <div className="h-[400px] w-full">
      <Map
        initialViewState={{ longitude: -73.9857, latitude: 40.7484, zoom: 15 }}
      >
        <MapController />
      </Map>
    </div>
  );
}
