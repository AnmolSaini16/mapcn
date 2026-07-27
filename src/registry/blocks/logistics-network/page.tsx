"use client";

import { FilterSidebar } from "./components/filter-sidebar";
import { NetworkMap } from "./components/network-map";
import { hubs, routes } from "./data";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <FilterSidebar
        hubs={hubs}
        routes={routes}
      />
      <SidebarInset>
        <NetworkMap
          hubs={hubs}
          routes={routes}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
