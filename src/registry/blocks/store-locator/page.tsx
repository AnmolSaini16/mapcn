import { useMemo, useState } from "react";
import { View } from "react-native";

import { LocatorMap } from "./components/locator-map";
import { StoreList } from "./components/store-list";
import { MAP_CENTER, stores } from "./data";

export default function Page() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(stores[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.neighborhood.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View className="h-screen flex-1 flex-row">
      <StoreList
        stores={filtered}
        query={query}
        onQueryChange={setQuery}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <View className="min-w-0 flex-1">
        <LocatorMap
          stores={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onClearSelection={() => {
            setSelectedId(null);
          }}
          center={MAP_CENTER}
        />
      </View>
    </View>
  );
}
