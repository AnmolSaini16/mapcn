import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Text } from "@/components/ui/text";
import { MapArc, MapMarker, MarkerContent, MarkerLabel } from "@/registry/map";

const hub = { name: "London", lng: -0.1276, lat: 51.5074 };

const destinations = [
  { name: "New York", lng: -74.006, lat: 40.7128 },
  { name: "São Paulo", lng: -46.6333, lat: -23.5505 },
  { name: "Cape Town", lng: 18.4241, lat: -33.9249 },
  { name: "Mumbai", lng: 72.8777, lat: 19.076 },
  { name: "Tokyo", lng: 139.6917, lat: 35.6895 },
];

const arcs = destinations.map((dest) => ({
  id: dest.name,
  from: [hub.lng, hub.lat] as [number, number],
  to: [dest.lng, dest.lat] as [number, number],
}));

export function ArcExample() {
  return (
    <ExampleCard className="aspect-square min-h-[280px]">
      <ExampleMap
        viewport={{
          center: [-0.1276, 41.5074],
          zoom: 1,
          bearing: 0,
          pitch: 0,
        }}
      >
        <MapArc
          data={arcs}
          color="#3b82f6"
          opacity={0.9}
          paint={{
            "line-dasharray": [2, 2],
          }}
          interactive={false}
        />

        <MapMarker
          longitude={hub.lng}
          latitude={hub.lat}
        >
          <MarkerContent>
            <View className="size-3 rounded-full border-2 border-white bg-blue-500" />
            <MarkerLabel position="top">
              <Text className="text-[10px] font-medium">{hub.name}</Text>
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {destinations.map((dest) => (
          <MapMarker
            key={dest.name}
            longitude={dest.lng}
            latitude={dest.lat}
          >
            <MarkerContent>
              <View className="size-2 rounded-full border-2 border-white bg-blue-500" />
              <MarkerLabel position="top">
                <Text className="text-[10px] font-medium">{dest.name}</Text>
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}
      </ExampleMap>
    </ExampleCard>
  );
}
