"use client";

import {
  Clock3,
  House,
  Store,
  Truck,
  UserRound,
  Utensils,
} from "lucide-react-native";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

import {
  buildRouteUrl,
  deliveryMeals,
  dropoff,
  mapView,
  pickup,
  progressFraction,
  routeStyle,
  type OsrmRouteData,
} from "./data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapMarker, MapRoute, MarkerContent } from "@/registry/map";

function formatDistance(meters?: number) {
  if (!meters) return "--";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return "--";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export default function Page() {
  const [routeData, setRouteData] = useState<OsrmRouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const remainingRouteColor =
    resolvedTheme === "dark"
      ? routeStyle.remaining.color.dark
      : routeStyle.remaining.color.light;

  useEffect(() => {
    async function fetchRoute() {
      setLoading(true);
      try {
        const response = await fetch(buildRouteUrl(pickup, dropoff));
        const data = await response.json();
        const route = data?.routes?.[0];
        if (!route?.geometry?.coordinates) return;

        setRouteData({
          coordinates: route.geometry.coordinates as [number, number][],
          duration: route.duration as number,
          distance: route.distance as number,
        });
      } catch (error) {
        console.error("Failed to fetch route:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoute();
  }, []);

  const progressCoordinates = useMemo(() => {
    const total = routeData?.coordinates?.length ?? 0;
    const progressCount = Math.max(2, Math.floor(total * progressFraction));
    return routeData?.coordinates?.slice(0, progressCount) ?? [];
  }, [routeData]);

  const courierPosition = progressCoordinates[progressCoordinates.length - 1];

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="bg-sidebar mx-auto grid w-[1200px] rounded-xl border md:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col p-5 md:p-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              Track Delivery
            </h3>
            <p className="text-muted-foreground text-sm">Mon Feb 10 - 2-3 PM</p>
          </div>

          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="font-medium">
                Order items ({deliveryMeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {deliveryMeals.map((meal) => (
                <div
                  key={meal.name}
                  className="flex items-center gap-3"
                >
                  <div className="bg-muted grid size-8 place-items-center rounded-full text-xs">
                    <Utensils className="text-muted-foreground size-4" />
                  </div>
                  <div className="min-w-4 flex-1">
                    <p className="truncate pb-1 text-sm font-medium">
                      {meal.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {meal.price}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="h-6 rounded-full px-2.5"
                  >
                    x{meal.quantity}
                  </Badge>
                </div>
              ))}
              <div className="border-border/60 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">Bundle total</span>
                <span className="font-medium">$189.00</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Pickup confirmed
                </p>
                <p className="text-sm font-medium">Mon, Feb 10 at 1:48 PM</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Remaining travel
                </p>
                <p className="text-sm font-medium">
                  {formatDuration(routeData?.duration)}
                  <span className="text-muted-foreground font-normal">
                    {" · "}
                    {formatDistance(routeData?.distance)}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button size="sm">
              <Clock3 />
              View timeline
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <UserRound />
              Contact courier
            </Button>
          </div>
        </div>

        <div className="relative h-[450px] overflow-hidden rounded-xl shadow-sm md:h-full">
          <Map
            loading={loading}
            center={mapView.center}
            zoom={mapView.zoom}
            minZoom={mapView.minZoom}
            maxZoom={mapView.maxZoom}
          >
            <MapRoute
              id="delivery-full-route"
              coordinates={routeData?.coordinates ?? []}
              color={remainingRouteColor}
              width={routeStyle.remaining.width}
              opacity={routeStyle.remaining.opacity}
              interactive={false}
            />
            <MapRoute
              id="delivery-progress-route"
              coordinates={progressCoordinates}
              color={routeStyle.progress.color}
              width={routeStyle.progress.width}
              opacity={routeStyle.progress.opacity}
              interactive={false}
            />

            {courierPosition && (
              <MapMarker
                longitude={courierPosition[0]}
                latitude={courierPosition[1]}
                offset={[0, 10]}
              >
                <MarkerContent>
                  <div
                    className="relative grid size-9 place-items-center rounded-full shadow-md"
                    style={{ backgroundColor: routeStyle.progress.color }}
                  >
                    <Truck className="size-4 text-white" />
                    <div className="bg-popover text-popover-foreground absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap shadow-md">
                      {formatDuration(routeData?.duration)} away
                      <span className="bg-popover absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b" />
                    </div>
                  </div>
                </MarkerContent>
              </MapMarker>
            )}

            <MapMarker
              longitude={pickup.lng}
              latitude={pickup.lat}
            >
              <MarkerContent>
                <div className="grid size-7 place-items-center rounded-full bg-emerald-500 shadow-md">
                  <Store className="size-3.5 text-white" />
                </div>
              </MarkerContent>
            </MapMarker>

            <MapMarker
              longitude={dropoff.lng}
              latitude={dropoff.lat}
            >
              <MarkerContent>
                <div className="grid size-7 place-items-center rounded-full bg-rose-500 shadow-md">
                  <House className="size-3.5 text-white" />
                </div>
              </MarkerContent>
            </MapMarker>
          </Map>
        </div>
      </div>
    </div>
  );
}
