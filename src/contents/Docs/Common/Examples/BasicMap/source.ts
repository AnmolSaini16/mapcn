export const basicMapExampleSource = `import { View } from "react-native";

import { Map } from "@/components/ui/map";

export function BasicMapExample() {
  return (
    <View className="h-[420px] w-full">
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
`;
