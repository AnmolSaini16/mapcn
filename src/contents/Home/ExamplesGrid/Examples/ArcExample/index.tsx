import { useState } from "react";
import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Text } from "@/components/ui/text";
import {
  MapArc,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerLabel,
} from "@/registry/map";

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
  const [selectedArcId, setSelectedArcId] = useState<string | null>(null);
  const selectedDestination = destinations.find(
    (destination) => destination.name === selectedArcId,
  );

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
          interactive
          opacity={0.9}
          paint={{
            "line-color": "#3b82f6",
            "line-dasharray": [2, 2],
          }}
          selectedId={selectedArcId}
          selectedPaint={{
            "line-color": "#1d4ed8",
            "line-width": 3,
            "line-opacity": 1,
          }}
          onClick={(event) => {
            const nextId =
              typeof event.arc.id === "string"
                ? event.arc.id
                : String(event.arc.id);
            setSelectedArcId((current) => (current === nextId ? null : nextId));
          }}
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

        {selectedDestination ? (
          <MapPopup
            closeButton
            latitude={(hub.lat + selectedDestination.lat) / 2}
            longitude={(hub.lng + selectedDestination.lng) / 2}
            onClose={() => {
              setSelectedArcId(null);
            }}
          >
            <View className="min-w-28 gap-0.5 pr-3">
              <Text className="text-sm font-semibold">
                {hub.name} → {selectedDestination.name}
              </Text>
              <Text className="text-muted-foreground text-xs">
                Tap again to clear
              </Text>
            </View>
          </MapPopup>
        ) : null}
      </ExampleMap>
    </ExampleCard>
  );
}
