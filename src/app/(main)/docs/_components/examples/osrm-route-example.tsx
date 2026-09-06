"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker, MarkerContent, MapRoute } from "@/registry/map";
import { cn } from "@/lib/utils";

const start = { name: "Amsterdam", lng: 4.9041, lat: 52.3676 };
const end = { name: "Rotterdam", lng: 4.4777, lat: 51.9244 };

// One color for every route: the selected one separates itself by weight and
// opacity, not hue. Shared by the lines and the list, so a swatch always
// matches its route.
const routeColor = "#3b82f6";
const inactiveOpacity = 0.35;

interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function OsrmRouteExample() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`,
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: {
              geometry: { coordinates: [number, number][] };
              duration: number;
              distance: number;
            }) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            }),
          );
          setRoutes(routeData);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, []);

  return (
    <div className="relative h-[500px] w-full">
      <Map center={[4.69, 52.14]} zoom={8.5} loading={isLoading}>
        {routes.map((route, index) => (
          <MapRoute
            key={index}
            coordinates={route.coordinates}
            active={index === selectedIndex}
            color={routeColor}
            width={5}
            opacity={inactiveOpacity}
            activeWidth={6}
            activeOpacity={1}
            onClick={() => setSelectedIndex(index)}
          />
        ))}

        <MapMarker longitude={start.lng} latitude={start.lat}>
          <MarkerContent>
            <div className="border-foreground bg-background size-3.5 rounded-full border-2 shadow-md" />
          </MarkerContent>
        </MapMarker>

        <MapMarker longitude={end.lng} latitude={end.lat}>
          <MarkerContent>
            <div className="bg-foreground ring-background size-3.5 rounded-full shadow-md ring-2" />
          </MarkerContent>
        </MapMarker>
      </Map>

      {routes.length > 0 && (
        <div
          role="radiogroup"
          aria-label="Route options"
          className="bg-background/95 border-border/50 absolute top-3 left-3 w-48 space-y-0.5 rounded-lg border p-1 shadow-lg backdrop-blur-md"
        >
          {routes.map((route, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={index}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
                  isActive ? "bg-muted" : "hover:bg-muted/50",
                )}
              >
                <span
                  className="h-4 w-0.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: routeColor,
                    opacity: isActive ? 1 : inactiveOpacity,
                  }}
                />
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    !isActive && "text-muted-foreground",
                  )}
                >
                  {formatDuration(route.duration)}
                </span>
                <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                  {formatDistance(route.distance)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
