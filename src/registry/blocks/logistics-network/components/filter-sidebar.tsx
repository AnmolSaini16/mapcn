"use client";

import { Network, Plane, Truck } from "lucide-react-native";

import { regionLabels, statusConfig, type Hub, type Route } from "../data";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const regionIcons: Record<Hub["region"], string> = {
  west: "W",
  midwest: "MW",
  south: "S",
  northeast: "NE",
};

interface FilterSidebarProps {
  hubs: Hub[];
  routes: Route[];
}

export function FilterSidebar({ hubs, routes }: FilterSidebarProps) {
  const totalShipments = routes.reduce((s, r) => s + r.shipments, 0);
  const activeCount = routes.filter((r) => r.status === "active").length;
  const delayedCount = routes.filter((r) => r.status === "delayed").length;
  const airRouteCount = routes.filter((r) => r.mode === "air").length;
  const groundRouteCount = routes.filter((r) => r.mode === "ground").length;

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Network className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-sm font-medium">Logistics Network</span>
            <span className="text-muted-foreground text-xs">
              Domestic Routes
            </span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-background rounded-md border px-2.5 py-2 text-center">
            <p className="text-lg leading-none font-bold tabular-nums">
              {hubs.length}
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">Hubs</p>
          </div>
          <div className="bg-background rounded-md border px-2.5 py-2 text-center">
            <p className="text-lg leading-none font-bold tabular-nums">
              {activeCount}
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">Active</p>
          </div>
          <div className="bg-background rounded-md border px-2.5 py-2 text-center">
            <p className="text-lg leading-none font-bold tabular-nums">
              {delayedCount}
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">Delayed</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Transport Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Air"
                  className="pointer-events-none"
                >
                  <Plane className="size-4" />
                  <span>Air Freight</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{airRouteCount}</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Ground"
                  className="pointer-events-none"
                >
                  <Truck className="size-4" />
                  <span>Ground</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{groundRouteCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={statusConfig.active.label}
                  className="pointer-events-none"
                >
                  <span className="flex size-4 items-center justify-center">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: statusConfig.active.color }}
                    />
                  </span>
                  <span>{statusConfig.active.label}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{activeCount}</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={statusConfig.delayed.label}
                  className="pointer-events-none"
                >
                  <span className="flex size-4 items-center justify-center">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: statusConfig.delayed.color }}
                    />
                  </span>
                  <span>{statusConfig.delayed.label}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{delayedCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Region</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(["west", "midwest", "south", "northeast"] as const).map(
                (region) => {
                  const hubsInRegion = hubs.filter((h) => h.region === region);
                  return (
                    <SidebarMenuItem key={region}>
                      <SidebarMenuButton
                        tooltip={regionLabels[region]}
                        className="pointer-events-none"
                      >
                        <span className="bg-muted text-muted-foreground flex size-4 items-center justify-center rounded text-[9px] font-bold">
                          {regionIcons[region]}
                        </span>
                        <span>{regionLabels[region]}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{hubsInRegion.length}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  );
                },
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-0">
        <p className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase">
          Summary
        </p>
        <div className="bg-background space-y-1.5 rounded-md border px-3 py-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipments</span>
            <span className="font-medium tabular-nums">
              {totalShipments.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Routes</span>
            <span className="font-medium tabular-nums">{routes.length}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
