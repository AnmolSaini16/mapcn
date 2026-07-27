"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { LocatorMap } from "./components/locator-map";
import { StoreList } from "./components/store-list";
import { MAP_CENTER, stores } from "./data";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider style={{ "--sidebar-width": "20rem" } as CSSProperties}>
      <StoreList
        stores={filtered}
        query={query}
        onQueryChange={setQuery}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <SidebarInset>
        <LocatorMap
          stores={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onClearSelection={() => {
            setSelectedId(null);
          }}
          center={MAP_CENTER}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
