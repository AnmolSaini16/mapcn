import { TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { getPreviewImages } from "@/lib/preview-images";
import { MapMarker, MarkerContent, MarkerPopup } from "@/registry/map";

const analyticsPreview = getPreviewImages("home-analytics");

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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <ExampleCard
      className="aspect-square min-h-[280px]"
      previewImage={analyticsPreview.light}
      previewImageDark={analyticsPreview.dark}
    >
      <View className="bg-background/95 border-border absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg">
        <Text className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">
          Active Users
        </Text>
        <Text className="text-2xl leading-tight font-semibold">3,544</Text>
        <View className="mt-1 flex-row items-center gap-1">
          <Icon
            as={TrendingUp}
            className="size-3"
          />
          <Text className="text-foreground text-xs">+12.5%</Text>
          <Text className="text-muted-foreground text-xs">vs last hour</Text>
        </View>
      </View>

      <ExampleMap
        viewport={{
          center: [0, 30],
          zoom: 1,
          bearing: 0,
          pitch: 0,
        }}
      >
        {analyticsData.map((loc) => (
          <MapMarker
            key={loc.city}
            longitude={loc.lng}
            latitude={loc.lat}
            onClick={() => {
              setSelectedCity((current) =>
                current === loc.city ? null : loc.city,
              );
            }}
          >
            <MarkerContent>
              <View
                className="rounded-full bg-blue-500/80 shadow-sm"
                style={{ width: loc.size * 1.8, height: loc.size * 1.8 }}
              />
              {selectedCity === loc.city ? (
                <MarkerPopup
                  className="min-w-24"
                  closeButton
                  onClose={() => {
                    setSelectedCity(null);
                  }}
                >
                  <View className="items-center gap-0.5 pr-3">
                    <Text className="text-sm font-medium">{loc.city}</Text>
                    <Text className="text-muted-foreground text-xs">
                      {loc.users} users
                    </Text>
                  </View>
                </MarkerPopup>
              ) : null}
            </MarkerContent>
          </MapMarker>
        ))}
      </ExampleMap>
    </ExampleCard>
  );
}
