import { PropsWithChildren } from "react";
import { View } from "react-native";

import { useLockParentScrollOnMapTouch } from "@/lib/parent-scroll-lock";
import { Map, type MapViewport } from "@/registry/map";

type ExampleMapProps = {
  viewport: MapViewport;
};

export function ExampleMap({
  viewport,
  children,
}: PropsWithChildren<ExampleMapProps>) {
  const mapTouchScrollLock = useLockParentScrollOnMapTouch();

  return (
    <View
      className="absolute inset-0"
      {...mapTouchScrollLock}
    >
      <Map
        viewport={viewport}
        style={{ flex: 1 }}
      >
        {children}
      </Map>
    </View>
  );
}
