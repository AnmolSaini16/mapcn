import { useState } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/registry/map";

const locations = [
  {
    id: 1,
    name: "Empire State Building",
    lng: -73.9857,
    lat: 40.7484,
  },
  {
    id: 2,
    name: "Central Park",
    lng: -73.9654,
    lat: 40.7829,
  },
  { id: 3, name: "Times Square", lng: -73.9855, lat: 40.758 },
];

export function MarkersExample() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <View className="h-[420px] w-full">
      <Map
        viewport={{
          center: [-73.98, 40.76],
          zoom: 12,
        }}
        style={{ flex: 1 }}
      >
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            longitude={location.lng}
            latitude={location.lat}
            onClick={() => {
              setSelectedId((current) =>
                current === location.id ? null : location.id,
              );
            }}
          >
            <MarkerContent>
              <View className="bg-primary size-4 rounded-full border-2 border-white shadow-lg" />
              <MarkerTooltip>
                <Text>{location.name}</Text>
              </MarkerTooltip>
              {selectedId === location.id ? (
                <MarkerPopup
                  closeButton
                  onClose={() => {
                    setSelectedId(null);
                  }}
                >
                  <View className="gap-1 pr-3">
                    <Text className="text-foreground font-medium">
                      {location.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </Text>
                  </View>
                </MarkerPopup>
              ) : null}
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>
    </View>
  );
}
