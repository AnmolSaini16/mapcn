export const advancedUsageExampleSource = `import { Mountain, RotateCcw } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Map, useMap } from "@/registry/map";

function MapController() {
  const { camera, viewport, isLoaded } = useMap();

  const handle3DView = () => {
    camera?.easeTo({
      center: viewport.center,
      zoom: viewport.zoom,
      pitch: 60,
      bearing: 340,
      duration: 1000,
    });
  };

  const handleReset = () => {
    camera?.easeTo({
      center: viewport.center,
      zoom: viewport.zoom,
      pitch: 0,
      bearing: 0,
      duration: 1000,
    });
  };

  if (!isLoaded) return null;

  return (
    <View
      className="absolute top-3 left-3 z-10 flex-col gap-2"
      pointerEvents="box-none"
    >
      <View
        className="flex-row gap-2"
        pointerEvents="box-none"
      >
        <Button
          size="sm"
          variant="secondary"
          onPress={handle3DView}
        >
          <Icon
            as={Mountain}
            className="size-4"
          />
          <Text>3D View</Text>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={handleReset}
        >
          <Icon
            as={RotateCcw}
            className="size-4"
          />
          <Text>Reset</Text>
        </Button>
      </View>
      <View className="bg-background/90 rounded-md border border-border px-3 py-2">
        <Text className="font-mono text-xs">
          Pitch: {Math.round(viewport.pitch)}°
        </Text>
        <Text className="font-mono text-xs">
          Bearing: {Math.round(viewport.bearing)}°
        </Text>
      </View>
    </View>
  );
}

export function AdvancedUsageExample() {
  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [-73.9857, 40.7484],
          zoom: 15,
        }}
        style={{ flex: 1 }}
      >
        <MapController />
      </Map>
    </View>
  );
}
`;
