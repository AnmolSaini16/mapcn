"use client";

import { useState } from "react";
import {
  Map,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  RouteMarker,
  RouteProgress,
} from "@/registry/map";
import { Car } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const route: [number, number][] = [
  [-122.394, 37.7953],
  [-122.3952, 37.7967],
  [-122.397, 37.7986],
  [-122.3975, 37.7992],
  [-122.3976, 37.7993],
  [-122.3981, 37.799],
  [-122.3984, 37.7989],
  [-122.4066, 37.7979],
  [-122.4071, 37.7981],
  [-122.4072, 37.7982],
  [-122.4072, 37.7984],
  [-122.4082, 37.8034],
  [-122.4064, 37.8037],
  [-122.4063, 37.8036],
  [-122.4063, 37.8034],
  [-122.4067, 37.8032],
  [-122.4067, 37.803],
  [-122.4067, 37.8028],
  [-122.4064, 37.8025],
  [-122.4062, 37.802],
  [-122.406, 37.8019],
  [-122.4058, 37.8018],
  [-122.4056, 37.8018],
  [-122.4055, 37.8019],
  [-122.4054, 37.8021],
  [-122.4056, 37.8025],
];

export function RouteProgressExample() {
  const [progress, setProgress] = useState(0.45);

  return (
    <div className="relative h-[420px] w-full">
      <Map center={[-122.4008, 37.7996]} zoom={14.2}>
        <MapRoute
          coordinates={route}
          progress={progress}
          color="#94a3b8"
          width={5}
          opacity={0.8}
          dashArray={[0.5, 1.5]}
        >
          <RouteProgress color="#3b82f6" width={5} opacity={1} />

          <RouteMarker at="start">
            <MarkerContent>
              <div className="border-foreground bg-background size-3.5 rounded-full border-2 shadow-md" />
            </MarkerContent>
          </RouteMarker>

          <RouteMarker at="progress">
            <MarkerContent>
              <div className="ring-background grid size-6 place-items-center rounded-full bg-blue-500 shadow-md ring-2">
                <Car className="size-3 text-white" />
              </div>
              <MarkerLabel
                position="top"
                className="bg-background/90 border-border/50 rounded-md border px-1.5 py-0.5 tabular-nums shadow-sm"
              >
                {Math.round(progress * 100)}%
              </MarkerLabel>
            </MarkerContent>
          </RouteMarker>

          <RouteMarker at="end">
            <MarkerContent>
              <div className="bg-foreground ring-background size-3.5 rounded-full shadow-md ring-2" />
            </MarkerContent>
          </RouteMarker>
        </MapRoute>
      </Map>

      <div className="bg-background/95 border-border/50 absolute bottom-3 left-3 w-56 rounded-lg border p-3 shadow-lg backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground tabular-nums">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <Slider
          value={[progress]}
          onValueChange={([value]) => setProgress(value)}
          min={0}
          max={1}
          step={0.01}
          aria-label="Route progress"
        />
      </div>
    </div>
  );
}
