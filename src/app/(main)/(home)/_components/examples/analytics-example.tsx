"use client";

import { Map, MapMarker, MarkerContent, MarkerTooltip } from "@/registry/map";
import { TrendingUp } from "lucide-react";
import { ExampleCard } from "./example-card";

const analyticsData = [
  { lng: -74.006, lat: 40.7128, city: "New York", users: 847, size: 14 },
  { lng: -0.1276, lat: 51.5074, city: "London", users: 623, size: 12 },
  { lng: 139.6917, lat: 35.6895, city: "Tokyo", users: 412, size: 10 },
  { lng: 114.1694, lat: 22.3193, city: "Hong Kong", users: 364, size: 10 },
  { lng: -122.4194, lat: 37.7749, city: "San Francisco", users: 298, size: 9 },
  { lng: 72.8777, lat: 19.076, city: "Mumbai", users: 271, size: 9 },
  { lng: 13.405, lat: 52.52, city: "Berlin", users: 187, size: 8 },
  { lng: 77.209, lat: 28.6139, city: "Delhi", users: 156, size: 7 },
  { lng: 151.2093, lat: -33.8688, city: "Sydney", users: 134, size: 7 },
  { lng: 18.4241, lat: -33.9249, city: "Cape Town", users: 118, size: 6 },
  { lng: -43.1729, lat: -22.9068, city: "Rio", users: 89, size: 6 },
  { lng: 126.978, lat: 37.5665, city: "Seoul", users: 45, size: 5 },
];

export function AnalyticsExample() {
  return (
    <ExampleCard className="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto">
      <div className="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md">
        <div className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">
          Active Users
        </div>
        <div className="text-2xl leading-tight font-semibold">3,544</div>
        <div className="mt-1 flex items-center gap-1">
          <TrendingUp className="size-3" />
          <span className="text-foreground text-xs">+12.5%</span>
          <span className="text-muted-foreground text-xs">vs last hour</span>
        </div>
      </div>

      <Map
        attributionControl={false}
        center={[0, 30]}
        scrollZoom={false}
        dragRotate={false}
        pitchWithRotate={false}
      >
        {analyticsData.map((loc) => (
          <MapMarker key={loc.city} longitude={loc.lng} latitude={loc.lat}>
            <MarkerContent>
              <div
                className="rounded-full bg-blue-500/80 shadow-sm"
                style={{ width: loc.size * 1.8, height: loc.size * 1.8 }}
              />
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-center">
                <div className="font-medium">{loc.city}</div>
                <div className="text-background/80">{loc.users} users</div>
              </div>
            </MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </ExampleCard>
  );
}
