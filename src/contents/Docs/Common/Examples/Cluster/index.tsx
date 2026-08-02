import { useState } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Map, MapClusterLayer, MapControls, MapPopup } from "@/registry/map";

interface EarthquakeProperties {
  mag: number;
  place: string;
  tsunami: number;
}

export function ClusterExample() {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: EarthquakeProperties;
  } | null>(null);

  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [-103.59, 40.66],
          zoom: 3.4,
        }}
        style={{ flex: 1 }}
      >
        <MapClusterLayer<EarthquakeProperties>
          data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
          clusterRadius={50}
          clusterMaxZoom={14}
          onPointClick={(feature, coordinates) => {
            setSelectedPoint({
              coordinates,
              properties: feature.properties,
            });
          }}
        />

        {selectedPoint ? (
          <MapPopup
            key={`${selectedPoint.coordinates[0]}-${selectedPoint.coordinates[1]}`}
            longitude={selectedPoint.coordinates[0]}
            latitude={selectedPoint.coordinates[1]}
            onClose={() => {
              setSelectedPoint(null);
            }}
            closeOnClick={false}
            closeButton
            className="min-w-36 pr-6"
          >
            <View className="gap-0.5">
              <Text className="text-muted-foreground text-[13px]">
                Magnitude:{" "}
                <Text className="text-foreground text-[13px] font-medium">
                  {selectedPoint.properties.mag}
                </Text>
              </Text>
              <Text className="text-muted-foreground text-[13px]">
                Tsunami:{" "}
                <Text className="text-foreground text-[13px]">
                  {selectedPoint.properties.tsunami === 1 ? "Yes" : "No"}
                </Text>
              </Text>
            </View>
          </MapPopup>
        ) : null}

        <MapControls />
      </Map>
    </View>
  );
}
