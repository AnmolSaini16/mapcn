"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Utensils, Truck, UserRound } from "lucide-react";

import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
} from "@/registry/map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliveryMeal {
  name: string;
  price: string;
  quantity: number;
}

interface OsrmRouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

const deliveryMeals: DeliveryMeal[] = [
  {
    name: "Spicy Tofu Grain Bowl",
    price: "$44.00",
    quantity: 1,
  },
  {
    name: "Herb Chicken Rice Box",
    price: "$58.00",
    quantity: 2,
  },
  {
    name: "Roasted Veggie Wrap",
    price: "$29.00",
    quantity: 1,
  },
];

const pickup = { lng: -122.466, lat: 37.716 };
const dropoff = { lng: -122.399, lat: 37.683 };

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

  useEffect(() => {
    async function fetchRoute() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`
        );
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
    const progressCount = Math.max(
      2,
      Math.floor(
        (routeData?.coordinates?.length ?? 0) * (routeData ? 0.62 : 0.66)
      )
    );
    return routeData?.coordinates?.slice(0, progressCount) ?? [];
  }, [routeData]);

  const courierPosition = progressCoordinates[progressCoordinates.length - 1];

  return (
    <div className="p-8">
      <div className="grid md:grid-cols-[1.05fr_1fr] bg-sidebar rounded-lg border md:h-[600px] max-w-7xl mx-auto">
        <div className="p-5 md:p-6 flex flex-col">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              Track Delivery
            </h3>
            <p className="text-sm text-muted-foreground">Mon Feb 10 - 2-3 PM</p>
          </div>

          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="font-medium">
                Order items ({deliveryMeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {deliveryMeals.map((meal) => (
                <div key={meal.name} className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium">
                    <Utensils className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-4 flex-1">
                    <p className="truncate text-sm font-medium pb-1">
                      {meal.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                <span className="text-muted-foreground">Bundle total</span>
                <span className="font-medium">$189.00</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Pickup confirmed
                </p>
                <p className="text-sm font-medium">Mon, Feb 10 at 1:48 PM</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Remaining travel
                </p>
                <p className="text-sm font-medium">
                  {formatDuration(routeData?.duration)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button size="sm" className="gap-1.5">
              <Clock3 className="size-4" />
              View timeline
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <UserRound className="size-4" />
              Contact courier
            </Button>
          </div>
        </div>

        <div className="relative h-[400px] overflow-hidden rounded-xl md:h-full shadow-sm">
          <Map
            loading={loading}
            center={[-122.435, 37.696]}
            zoom={12}
            minZoom={10}
            maxZoom={16}
            styles={undefined}
          >
            <MapRoute
              id="delivery-full-route"
              coordinates={routeData?.coordinates ?? []}
              color="#5b6572"
              width={5.2}
              opacity={0.3}
              interactive={false}
            />
            <MapRoute
              id="delivery-progress-route"
              coordinates={progressCoordinates}
              color="#3b82f6"
              width={6}
              opacity={0.95}
              interactive={false}
            />

            {courierPosition && (
              <MapMarker
                longitude={courierPosition[0]}
                latitude={courierPosition[1]}
                offset={[0, 10]}
              >
                <MarkerContent>
                  <div className="relative grid size-9 place-items-center rounded-full bg-emerald-500 dark:bg-emerald-600">
                    <Truck className="size-4 text-white" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-medium">
                      Order {formatDuration(routeData?.duration)} away
                    </p>
                    <p className="text-muted-foreground">
                      Route {formatDistance(routeData?.distance)}
                    </p>
                  </div>
                </MarkerTooltip>
              </MapMarker>
            )}

            <MapMarker longitude={pickup.lng} latitude={pickup.lat}>
              <MarkerContent>
                <div className="size-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
              </MarkerContent>
              <MarkerTooltip>
                <p className="text-xs font-medium">Origin</p>
              </MarkerTooltip>
            </MapMarker>

            <MapMarker longitude={dropoff.lng} latitude={dropoff.lat}>
              <MarkerContent>
                <div className="size-4 rounded-full border-2 border-white bg-rose-500 shadow-sm" />
              </MarkerContent>
              <MarkerTooltip>
                <p className="text-xs font-medium">Destination</p>
              </MarkerTooltip>
            </MapMarker>
          </Map>
        </div>
      </div>
    </div>
  );
}
