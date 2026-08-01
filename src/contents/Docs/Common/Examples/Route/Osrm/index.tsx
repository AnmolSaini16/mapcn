import { Clock, Route } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
} from "@/registry/map";

const start = { name: "Amsterdam", lng: 4.9041, lat: 52.3676 };
const end = { name: "Rotterdam", lng: 4.4777, lat: 51.9244 };

type RouteData = {
  coordinates: [number, number][];
  duration: number;
  distance: number;
};

type OsrmRouteResponse = {
  routes?: {
    geometry: { coordinates: [number, number][] };
    duration: number;
    distance: number;
  }[];
};

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${String(mins)} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${String(hours)}h ${String(remainingMins)}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${String(Math.round(meters))} m`;
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
          `https://router.project-osrm.org/route/v1/driving/${String(start.lng)},${String(start.lat)};${String(end.lng)},${String(end.lat)}?overview=full&geometries=geojson&alternatives=true`,
        );
        const data = (await response.json()) as OsrmRouteResponse;

        if (data.routes && data.routes.length > 0) {
          setRoutes(
            data.routes.map((route) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchRoutes();
  }, []);

  const sortedRoutes = routes
    .map((route, index) => ({ route, index }))
    .sort((a, b) => {
      if (a.index === selectedIndex) return 1;
      if (b.index === selectedIndex) return -1;
      return 0;
    });

  return (
    <View className="relative h-[500px] w-full">
      <Map
        viewport={{
          center: [4.69, 52.14],
          zoom: 8.5,
        }}
        style={{ flex: 1 }}
      >
        {sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color={isSelected ? "#6366f1" : "#94a3b8"}
              width={isSelected ? 6 : 5}
              opacity={isSelected ? 1 : 0.6}
              onClick={() => {
                setSelectedIndex(index);
              }}
            />
          );
        })}

        <MapMarker
          longitude={start.lng}
          latitude={start.lat}
        >
          <MarkerContent>
            <View className="size-5 rounded-full border-2 border-white bg-green-500 shadow-lg" />
            <MarkerLabel position="top">{start.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        <MapMarker
          longitude={end.lng}
          latitude={end.lat}
        >
          <MarkerContent>
            <View className="size-5 rounded-full border-2 border-white bg-red-500 shadow-lg" />
            <MarkerLabel position="bottom">{end.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>

      {routes.length > 0 ? (
        <View className="absolute top-3 left-3 flex-col gap-2">
          {routes.map((route, index) => {
            const isActive = index === selectedIndex;
            const isFastest = index === 0;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "secondary"}
                size="sm"
                onPress={() => {
                  setSelectedIndex(index);
                }}
                className="justify-start gap-3"
              >
                <View className="flex-row items-center gap-1.5">
                  <Icon
                    as={Clock}
                    size={14}
                  />
                  <Text className="font-medium">
                    {formatDuration(route.duration)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 opacity-80">
                  <Icon
                    as={Route}
                    size={12}
                  />
                  <Text className="text-xs">
                    {formatDistance(route.distance)}
                  </Text>
                </View>
                {isFastest ? (
                  <Text className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                    Fastest
                  </Text>
                ) : null}
              </Button>
            );
          })}
        </View>
      ) : null}

      {isLoading ? (
        <View className="bg-background/50 absolute inset-0 items-center justify-center">
          <ActivityIndicator className="text-muted-foreground" />
        </View>
      ) : null}
    </View>
  );
}
