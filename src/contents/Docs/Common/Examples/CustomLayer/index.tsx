import {
  GeoJSONSource,
  Layer,
  type PressEventWithFeatures,
} from "@maplibre/maplibre-react-native";
import { Layers, X } from "lucide-react-native";
import { useState } from "react";
import { View, type NativeSyntheticEvent } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Map, MapControls } from "@/registry/map";

const geojsonData: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Central Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9731, 40.7644],
            [-73.9819, 40.7681],
            [-73.958, 40.8006],
            [-73.9493, 40.7969],
            [-73.9731, 40.7644],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Bryant Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9837, 40.7536],
            [-73.9854, 40.7542],
            [-73.984, 40.7559],
            [-73.9823, 40.7553],
            [-73.9837, 40.7536],
          ],
        ],
      },
    },
  ],
};

function CustomLayer() {
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [selectedPark, setSelectedPark] = useState<string | null>(null);

  const visibility = isLayerVisible ? "visible" : "none";

  const handlePress = (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
    if (!isLayerVisible) return;
    const properties: unknown = event.nativeEvent.features[0]?.properties;
    const name =
      typeof properties === "object" &&
      properties !== null &&
      "name" in properties &&
      typeof properties.name === "string"
        ? properties.name
        : null;
    setSelectedPark(name);
  };

  return (
    <>
      <GeoJSONSource
        id="parks"
        data={geojsonData}
        onPress={handlePress}
      >
        <Layer
          id="parks-fill"
          type="fill"
          paint={{
            "fill-color": "#22c55e",
            "fill-opacity": 0.4,
          }}
          layout={{
            visibility,
          }}
        />
        <Layer
          id="parks-outline"
          type="line"
          paint={{
            "line-color": "#16a34a",
            "line-width": 2,
          }}
          layout={{
            visibility,
          }}
        />
      </GeoJSONSource>

      <View
        className="absolute top-3 left-3 z-10"
        pointerEvents="box-none"
      >
        <Button
          size="sm"
          variant={isLayerVisible ? "default" : "secondary"}
          onPress={() => {
            setIsLayerVisible((current) => !current);
            setSelectedPark(null);
          }}
        >
          <Icon
            as={isLayerVisible ? X : Layers}
            className="size-4"
          />
          <Text>{isLayerVisible ? "Hide Parks" : "Show Parks"}</Text>
        </Button>
      </View>

      {selectedPark ? (
        <View className="bg-background/90 absolute bottom-3 left-3 z-10 rounded-md border px-3 py-2">
          <Text className="text-sm font-medium">{selectedPark}</Text>
        </View>
      ) : null}
    </>
  );
}

export function CustomLayerExample() {
  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [-73.97, 40.78],
          zoom: 11.8,
        }}
        style={{ flex: 1 }}
      >
        <MapControls />
        <CustomLayer />
      </Map>
    </View>
  );
}
