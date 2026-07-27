import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/ui/text";
import {
  DefaultMarkerIcon,
  Map,
  MapArc,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/registry/map";

const cities = {
  paris: {
    name: "Paris",
    country: "France",
    longitude: 2.3522,
    latitude: 48.8566,
  },
  london: {
    name: "London",
    country: "United Kingdom",
    longitude: -0.1276,
    latitude: 51.5074,
  },
  berlin: {
    name: "Berlin",
    country: "Germany",
    longitude: 13.405,
    latitude: 52.52,
  },
} as const;

type CityId = keyof typeof cities;

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState<CityId | null>(null);

  return (
    <View className="bg-background flex-1">
      <Map
        viewport={{
          center: [8, 50],
          zoom: 4.5,
        }}
      >
        <MapRoute
          color="#3b82f6"
          coordinates={[
            [cities.paris.longitude, cities.paris.latitude],
            [cities.london.longitude, cities.london.latitude],
          ]}
        />
        <MapArc
          color="#6366f1"
          data={[
            {
              from: [cities.paris.longitude, cities.paris.latitude],
              to: [cities.berlin.longitude, cities.berlin.latitude],
            },
          ]}
        />
        {(Object.entries(cities) as [CityId, (typeof cities)[CityId]][]).map(
          ([id, city]) => (
            <MapMarker
              key={id}
              latitude={city.latitude}
              longitude={city.longitude}
              onClick={() => {
                setSelectedCity((current) => (current === id ? null : id));
              }}
            >
              <MarkerContent>
                <DefaultMarkerIcon />
                {selectedCity === id ? (
                  <MarkerPopup className="mt-2 min-w-28">
                    <Text className="text-sm font-semibold">{city.name}</Text>
                    <Text className="text-muted-foreground text-xs">
                      {city.country}
                    </Text>
                  </MarkerPopup>
                ) : (
                  <MarkerLabel className="mt-1">{city.name}</MarkerLabel>
                )}
              </MarkerContent>
            </MapMarker>
          ),
        )}
        <MapControls showLocate={false} />
      </Map>
      <SafeAreaView
        className="pointer-events-none absolute inset-x-0 top-0"
        edges={["top"]}
      >
        <View className="mx-4 mt-2 rounded-lg border border-border bg-background/90 px-4 py-3">
          <Text className="text-lg font-semibold">mapcn</Text>
          <Text className="text-muted-foreground text-sm">
            Tap a marker to explore
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
