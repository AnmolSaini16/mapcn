export const geojsonExampleSource = `import { View } from "react-native";

import { WORLD_GEOJSON } from "@/lib/use-world-data";
import { Map, MapGeoJSON } from "@/components/ui/map";

export function GeoJSONExample() {
  return (
    <View className="h-full w-full">
      <Map
        blank
        viewport={{
          center: [10, 25],
          zoom: 1,
        }}
        style={{ flex: 1 }}
      >
        <MapGeoJSON
          data={WORLD_GEOJSON}
          linePaint={false}
        />
      </Map>
    </View>
  );
}
`;
