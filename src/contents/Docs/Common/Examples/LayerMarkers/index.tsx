import {
  GeoJSONSource,
  Layer,
  type PressEventWithFeatures,
} from "@maplibre/maplibre-react-native";
import { useId, useState } from "react";
import { View, type NativeSyntheticEvent } from "react-native";

import { Text } from "@/components/ui/text";
import { Map, MapPopup } from "@/registry/map";

function generateRandomPoints(count: number) {
  const center = { lng: -73.98, lat: 40.75 };
  const features: GeoJSON.Feature<GeoJSON.Point>[] = [];

  for (let i = 0; i < count; i++) {
    const lng = center.lng + (Math.random() - 0.5) * 0.15;
    const lat = center.lat + (Math.random() - 0.5) * 0.1;
    features.push({
      type: "Feature",
      properties: {
        id: i,
        name: `Location ${i + 1}`,
        category: ["Restaurant", "Cafe", "Bar", "Shop"][
          Math.floor(Math.random() * 4)
        ],
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
  }

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

const pointsData = generateRandomPoints(200);

interface SelectedPoint {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
}

function parseSelectedPoint(
  event: NativeSyntheticEvent<PressEventWithFeatures>,
): SelectedPoint | null {
  const feature = event.nativeEvent.features[0];
  if (!feature) return null;

  const properties: unknown = feature.properties;
  if (typeof properties !== "object" || properties === null) return null;

  const id = "id" in properties ? properties.id : null;
  const name = "name" in properties ? properties.name : null;
  const category = "category" in properties ? properties.category : null;
  const [longitude, latitude] = event.nativeEvent.lngLat;

  if (
    typeof id !== "number" ||
    typeof name !== "string" ||
    typeof category !== "string"
  ) {
    return null;
  }

  return {
    id,
    name,
    category,
    coordinates: [longitude, latitude],
  };
}

function MarkersLayer() {
  const id = useId();
  const sourceId = `markers-source-${id}`;
  const layerId = `markers-layer-${id}`;
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(
    null,
  );

  return (
    <>
      <GeoJSONSource
        id={sourceId}
        data={pointsData}
        onPress={(event) => {
          setSelectedPoint(parseSelectedPoint(event));
        }}
      >
        <Layer
          id={layerId}
          type="circle"
          paint={{
            "circle-radius": 6,
            "circle-color": "#3b82f6",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          }}
        />
      </GeoJSONSource>

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
          className="min-w-28 pr-6"
        >
          <View className="gap-0.5">
            <Text className="font-medium">{selectedPoint.name}</Text>
            <Text className="text-muted-foreground text-sm">
              {selectedPoint.category}
            </Text>
          </View>
        </MapPopup>
      ) : null}
    </>
  );
}

export function LayerMarkersExample() {
  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [-73.98, 40.75],
          zoom: 11,
        }}
        style={{ flex: 1 }}
      >
        <MarkersLayer />
      </Map>
    </View>
  );
}
