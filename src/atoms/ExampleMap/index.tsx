import { PropsWithChildren } from "react";
import { View } from "react-native";

import { Map, type MapViewport } from "@/registry/map";

type ExampleMapProps = {
  viewport: MapViewport;
};

export function ExampleMap({
  viewport,
  children,
}: PropsWithChildren<ExampleMapProps>) {
  return (
    <View className="absolute inset-0">
      <Map
        viewport={viewport}
        style={{ flex: 1 }}
      >
        {children}
      </Map>
    </View>
  );
}
