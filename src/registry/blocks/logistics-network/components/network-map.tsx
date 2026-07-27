"use client";

import { useMemo } from "react";

import {
  modeConfig,
  regionLabels,
  statusConfig,
  type Hub,
  type Route,
} from "../data";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Map,
  MapArc,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/registry/map";

interface NetworkMapProps {
  hubs: Hub[];
  routes: Route[];
}

function MapControlsCard() {
  return (
    <div className="border-border/40 bg-background/70 absolute top-4 left-4 z-20 flex items-center gap-3 rounded-lg border px-2.5 py-1.5 backdrop-blur-sm">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="h-4!"
      />
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: modeConfig.air.color }}
          />
          <span>{modeConfig.air.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: modeConfig.ground.color }}
          />
          <span>{modeConfig.ground.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: statusConfig.delayed.color }}
          />
          <span>{statusConfig.delayed.label}</span>
        </div>
        <Separator
          orientation="vertical"
          className="h-4!"
        />
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 shrink-0 rounded-full border border-white bg-blue-500 shadow-sm" />
          <span>Hub</span>
        </div>
      </div>
    </div>
  );
}

export function NetworkMap({ hubs, routes }: NetworkMapProps) {
  const arcs = useMemo(() => {
    const hubById: Record<string, Hub> = Object.fromEntries(
      hubs.map((hub) => [hub.id, hub]),
    );
    return routes.flatMap((route) => {
      const fromHub = hubById[route.from];
      const toHub = hubById[route.to];
      if (!fromHub || !toHub) return [];
      return [
        {
          id: `${route.from}-${route.to}`,
          from: [fromHub.lng, fromHub.lat] as [number, number],
          to: [toHub.lng, toHub.lat] as [number, number],
          color:
            route.status === "delayed"
              ? statusConfig.delayed.color
              : modeConfig[route.mode].color,
        },
      ];
    });
  }, [hubs, routes]);

  return (
    <div className="relative h-full">
      <MapControlsCard />

      <Map
        center={[-98, 39]}
        zoom={4}
        projection={{ type: "globe" }}
      >
        <MapControls />
        <MapArc
          data={arcs}
          curvature={0.3}
          paint={{
            "line-color": ["get", "color"],
            "line-width": 2,
            "line-opacity": 0.65,
          }}
          interactive={false}
        />

        {hubs.map((hub) => (
          <MapMarker
            key={hub.id}
            longitude={hub.lng}
            latitude={hub.lat}
          >
            <MarkerContent>
              <div className="size-3 rounded-full border-2 border-white bg-blue-500 shadow-md" />
            </MarkerContent>
            <MarkerTooltip
              offset={16}
              className="bg-background text-foreground border px-2.5 py-1.5"
            >
              <p className="font-medium">{hub.city}</p>
              <p className="text-muted-foreground mt-1">
                {hub.shipments.toLocaleString()} shipments
                <span className="mx-1">•</span>
                {regionLabels[hub.region]}
              </p>
            </MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
