import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { blockComponents } from "@/registry/blocks/__index__";

export default function BlockViewPage() {
  const { name } = useLocalSearchParams<{
    name: string;
  }>();

  const Component = blockComponents[name];

  if (!Component) {
    router.push("/+not-found");
    return;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
      className="bg-background"
    >
      <Component />
    </View>
  );
}
