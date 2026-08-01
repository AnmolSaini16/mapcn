import { View } from "react-native";

import { WORLD_GEOJSON } from "@/lib/use-world-data";
import { Map, MapGeoJSON } from "@/registry/map";

export function BlankMapExample() {
  return (
    <View className="h-[420px] w-full">
      {/* `blank` is a transparent canvas - add your own layers on top. */}
      <Map
        blank
        viewport={{
          center: [10, 25],
          zoom: 1,
        }}
        style={{ flex: 1 }}
      >
        <MapGeoJSON data={WORLD_GEOJSON} />
      </Map>
    </View>
  );
}
