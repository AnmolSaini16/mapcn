import { View } from "react-native";

import { Map, MapGeoJSON } from "@/registry/map";

// Inline GeoJSON polygon covering a downtown area.
const area: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.42, 37.78],
            [-122.398, 37.785],
            [-122.392, 37.768],
            [-122.412, 37.758],
            [-122.43, 37.77],
            [-122.42, 37.78],
          ],
        ],
      },
    },
  ],
};

export function MapOverlayExample() {
  return (
    <View className="h-full w-full">
      {/* Default basemap with a translucent GeoJSON polygon on top. */}
      <Map
        viewport={{
          center: [-122.41, 37.772],
          zoom: 12,
        }}
        style={{ flex: 1 }}
      >
        <MapGeoJSON
          data={area}
          fillPaint={{ "fill-color": "#3b82f6", "fill-opacity": 0.25 }}
          linePaint={{ "line-color": "#2563eb", "line-width": 2 }}
        />
      </Map>
    </View>
  );
}
