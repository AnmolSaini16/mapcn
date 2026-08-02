import { View } from "react-native";

import { Text } from "@/components/ui/text";
import {
  Map,
  MapArc,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/registry/map";

const hub = { name: "London", lng: -0.1276, lat: 51.5074 };

const destinations = [
  { name: "New York", lng: -74.006, lat: 40.7128 },
  { name: "São Paulo", lng: -46.6333, lat: -23.5505 },
  { name: "Cape Town", lng: 18.4241, lat: -33.9249 },
  { name: "Dubai", lng: 55.2708, lat: 25.2048 },
  { name: "Mumbai", lng: 72.8777, lat: 19.076 },
  { name: "Singapore", lng: 103.8198, lat: 1.3521 },
  { name: "Tokyo", lng: 139.6917, lat: 35.6895 },
  { name: "Sydney", lng: 151.2093, lat: -33.8688 },
];

const arcs = destinations.map((dest) => ({
  id: dest.name,
  from: [hub.lng, hub.lat] as [number, number],
  to: [dest.lng, dest.lat] as [number, number],
}));

export function ArcExample() {
  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [hub.lng, hub.lat],
          zoom: 1,
        }}
        style={{ flex: 1 }}
      >
        <MapArc
          data={arcs}
          paint={{
            "line-color": "#3b82f6",
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
            <MarkerLabel
              position="top"
              className="bg-background/80 rounded-sm px-1.5 py-0.5 backdrop-blur"
            >
              <Text className="text-[11px] font-semibold">{hub.name}</Text>
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
      </Map>
    </View>
  );
}
