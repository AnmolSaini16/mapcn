"use client";

import { useRef, useState } from "react";

import { Map, MapMarker, MapRef, MarkerContent } from "@/registry/map";
import { Button } from "@/components/ui/button";
import { ExampleCard } from "./example-card";

const destinations = [
  { name: "New York", center: [-74.006, 40.7128] as [number, number] },
  { name: "London", center: [-0.1276, 51.5074] as [number, number] },
  { name: "Tokyo", center: [139.6917, 35.6895] as [number, number] },
  { name: "Sydney", center: [151.2093, -33.8688] as [number, number] },
];

export function FlyToExample() {
  const mapRef = useRef<MapRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const flyTo = (index: number) => {
    setActiveIndex(index);
    mapRef.current?.flyTo({
      center: destinations[index].center,
      zoom: 6,
      duration: 2000,
      essential: true,
    });
  };

  const active = destinations[activeIndex];

  return (
    <ExampleCard className="aspect-square">
      <Map
        attributionControl={false}
        ref={mapRef}
        center={active.center}
        zoom={5.5}
        scrollZoom={false}
        dragRotate={false}
        pitchWithRotate={false}
      >
        <MapMarker longitude={active.center[0]} latitude={active.center[1]}>
          <MarkerContent>
            <div className="flex items-center justify-center">
              <div className="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>

      <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
        {destinations.map((dest, index) => (
          <Button
            key={dest.name}
            size="xs"
            variant={index === activeIndex ? "default" : "secondary"}
            onClick={() => flyTo(index)}
            className="rounded-full border"
          >
            {dest.name}
          </Button>
        ))}
      </div>
    </ExampleCard>
  );
}
