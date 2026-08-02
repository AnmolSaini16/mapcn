export const controlledMapExampleSource = `import { useState } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Map, type MapViewport } from "@/components/ui/map";

export function ControlledMapExample() {
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-74.006, 40.7128],
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  return (
    <View className="relative h-full w-full">
      <Map
        viewport={viewport}
        onViewportChange={setViewport}
        style={{ flex: 1 }}
      />
      <View className="border-border bg-background/80 absolute top-2 left-2 z-10 max-w-64 flex-row flex-wrap gap-x-2 gap-y-0.5 rounded border px-2 py-1.5">
        <Text className="font-mono text-[11px]">
          lng: {viewport.center[0].toFixed(3)}
        </Text>
        <Text className="font-mono text-[11px]">
          lat: {viewport.center[1].toFixed(3)}
        </Text>
        <Text className="font-mono text-[11px]">
          zoom: {viewport.zoom.toFixed(1)}
        </Text>
        <Text className="font-mono text-[11px]">
          bearing: {viewport.bearing.toFixed(1)}°
        </Text>
        <Text className="font-mono text-[11px]">
          pitch: {viewport.pitch.toFixed(1)}°
        </Text>
      </View>
    </View>
  );
}
`;
