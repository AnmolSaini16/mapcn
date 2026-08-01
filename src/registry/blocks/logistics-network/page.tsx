import { View } from "react-native";

import { FilterSidebar } from "./components/filter-sidebar";
import { NetworkMap } from "./components/network-map";
import { hubs, routes } from "./data";

export default function Page() {
  return (
    <View className="h-screen flex-1 flex-row">
      <FilterSidebar
        hubs={hubs}
        routes={routes}
      />
      <View className="min-w-0 flex-1">
        <NetworkMap
          hubs={hubs}
          routes={routes}
        />
      </View>
    </View>
  );
}
