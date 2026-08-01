export const routeExampleSource = `import { View } from "react-native";

import { Text } from "@/components/ui/text";
import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";

const route = [
  [-74.006, 40.7128], // NYC City Hall
  [-73.9857, 40.7484], // Empire State Building
  [-73.9772, 40.7527], // Grand Central
  [-73.9654, 40.7829], // Central Park
] as [number, number][];

const stops = [
  { name: "City Hall", lng: -74.006, lat: 40.7128 },
  { name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { name: "Grand Central Terminal", lng: -73.9772, lat: 40.7527 },
  { name: "Central Park", lng: -73.9654, lat: 40.7829 },
];

export function RouteExample() {
  return (
    <View className="h-[420px] w-full">
      <Map
        viewport={{
          center: [-73.98, 40.75],
          zoom: 11.2,
        }}
        style={{ flex: 1 }}
      >
        <MapRoute
          coordinates={route}
          color="#3b82f6"
          width={4}
          opacity={0.8}
        />

        {stops.map((stop, index) => (
          <MapMarker
            key={stop.name}
            longitude={stop.lng}
            latitude={stop.lat}
          >
            <MarkerContent>
              <View className="size-4.5 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
                <Text className="text-xs font-semibold text-white">
                  {index + 1}
                </Text>
              </View>
            </MarkerContent>
            <MarkerTooltip className="bg-foreground">
              <Text className="text-background">{stop.name}</Text>
            </MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </View>
  );
}
`;
