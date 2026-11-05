"use client";

import { useMemo, useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { hubs, routes, type Filter } from "./data";
import { FilterSidebar } from "./components/filter-sidebar";
import { NetworkMap } from "./components/network-map";

export default function Page() {
  const [hidden, setHidden] = useState<Set<Filter>>(new Set());

  function toggle(filter: Filter) {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }

  const visibleHubs = useMemo(
    () => hubs.filter((hub) => !hidden.has(hub.region)),
    [hidden],
  );
  const visibleRoutes = useMemo(() => {
    const visibleHubIds = new Set(visibleHubs.map((hub) => hub.id));
    return routes.filter(
      (route) =>
        !hidden.has(route.mode) &&
        !hidden.has(route.status) &&
        visibleHubIds.has(route.from) &&
        visibleHubIds.has(route.to),
    );
  }, [hidden, visibleHubs]);

  return (
    <SidebarProvider>
      <FilterSidebar
        hubs={hubs}
        routes={routes}
        visibleRoutes={visibleRoutes}
        hidden={hidden}
        onToggle={toggle}
      />
      <SidebarInset>
        <NetworkMap hubs={visibleHubs} routes={visibleRoutes} />
      </SidebarInset>
    </SidebarProvider>
  );
}
