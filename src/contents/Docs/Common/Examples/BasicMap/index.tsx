import { View } from "react-native";

import { Map } from "@/registry/map";

export function BasicMapExample() {
  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [-74.006, 40.7128],
          zoom: 12,
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
