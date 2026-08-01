import {
  Clock3,
  House,
  Store,
  Truck,
  UserRound,
  Utensils,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";

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
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
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
  const colorScheme = useColorScheme();
  const remainingRouteColor =
    colorScheme === "dark"
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

    void fetchRoute();
  }, []);

  const progressCoordinates = useMemo(() => {
    const total = routeData?.coordinates?.length ?? 0;
    const progressCount = Math.max(2, Math.floor(total * progressFraction));
    return routeData?.coordinates?.slice(0, progressCount) ?? [];
  }, [routeData]);

  const courierPosition = progressCoordinates[progressCoordinates.length - 1];

  return (
    <View className="min-h-screen flex-1 items-center justify-center p-8">
      <View className="bg-sidebar w-full max-w-5xl flex-row overflow-hidden rounded-xl border">
        <View className="flex-1 flex-col p-5 md:p-6">
          <View className="gap-1">
            <Text className="text-2xl font-semibold tracking-tight">
              Track Delivery
            </Text>
            <Text className="text-muted-foreground text-sm">
              Mon Feb 10 - 2-3 PM
            </Text>
          </View>

          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="font-medium">
                Order items ({deliveryMeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-5">
              {deliveryMeals.map((meal) => (
                <View
                  key={meal.name}
                  className="flex-row items-center gap-3"
                >
                  <View className="bg-muted size-8 items-center justify-center rounded-full">
                    <Icon
                      as={Utensils}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text
                      className="pb-1 text-sm font-medium"
                      numberOfLines={1}
                    >
                      {meal.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      {meal.price}
                    </Text>
                  </View>
                  <Badge
                    variant="secondary"
                    className="h-6 rounded-full px-2.5"
                  >
                    <Text className="text-xs">x{meal.quantity}</Text>
                  </Badge>
                </View>
              ))}
              <View className="border-border/60 flex-row items-center justify-between border-t pt-3">
                <Text className="text-muted-foreground text-sm">
                  Bundle total
                </Text>
                <Text className="text-sm font-medium">$189.00</Text>
              </View>
            </CardContent>
          </Card>

          <View className="mt-4 flex-row gap-3">
            <Card className="flex-1">
              <CardContent className="gap-2">
                <Text className="text-muted-foreground text-sm">
                  Pickup confirmed
                </Text>
                <Text className="text-sm font-medium">
                  Mon, Feb 10 at 1:48 PM
                </Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="gap-2">
                <Text className="text-muted-foreground text-sm">
                  Remaining travel
                </Text>
                <Text className="text-sm font-medium">
                  {formatDuration(routeData?.duration)}
                  <Text className="text-muted-foreground font-normal">
                    {" · "}
                    {formatDistance(routeData?.distance)}
                  </Text>
                </Text>
              </CardContent>
            </Card>
          </View>

          <View className="mt-6 flex-row flex-wrap items-center gap-2">
            <Button size="sm">
              <Icon
                as={Clock3}
                size={16}
              />
              <Text>View timeline</Text>
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Icon
                as={UserRound}
                size={16}
              />
              <Text>Contact courier</Text>
            </Button>
          </View>
        </View>

        <View className="relative h-[450px] min-w-0 flex-1 overflow-hidden rounded-xl shadow-sm">
          <Map
            loading={loading}
            viewport={{
              center: mapView.center,
              zoom: mapView.zoom,
            }}
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

            {courierPosition ? (
              <MapMarker
                longitude={courierPosition[0]}
                latitude={courierPosition[1]}
                offset={[0, 10]}
              >
                <MarkerContent>
                  <View
                    className="relative size-9 items-center justify-center rounded-full shadow-md"
                    style={{ backgroundColor: routeStyle.progress.color }}
                  >
                    <Icon
                      as={Truck}
                      size={16}
                      className="text-white"
                    />
                    <View className="bg-popover border-border absolute bottom-full mb-2.5 rounded-md border px-2 py-1 shadow-md">
                      <Text className="text-popover-foreground text-xs font-medium">
                        {formatDuration(routeData?.duration)} away
                      </Text>
                    </View>
                  </View>
                </MarkerContent>
              </MapMarker>
            ) : null}

            <MapMarker
              longitude={pickup.lng}
              latitude={pickup.lat}
            >
              <MarkerContent>
                <View className="size-7 items-center justify-center rounded-full bg-emerald-500 shadow-md">
                  <Icon
                    as={Store}
                    size={14}
                    className="text-white"
                  />
                </View>
              </MarkerContent>
            </MapMarker>

            <MapMarker
              longitude={dropoff.lng}
              latitude={dropoff.lat}
            >
              <MarkerContent>
                <View className="size-7 items-center justify-center rounded-full bg-rose-500 shadow-md">
                  <Icon
                    as={House}
                    size={14}
                    className="text-white"
                  />
                </View>
              </MarkerContent>
            </MapMarker>
          </Map>
        </View>
      </View>
    </View>
  );
}
