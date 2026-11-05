"use client";

import {
  Sidebar,
  SidebarContent,
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
import { MapPin, Network, Plane, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  regionLabels,
  statusConfig,
  type Filter,
  type Hub,
  type Route,
} from "../data";

interface FilterSidebarProps {
  hubs: Hub[];
  routes: Route[];
  visibleRoutes: Route[];
  hidden: Set<Filter>;
  onToggle: (filter: Filter) => void;
}

export function FilterSidebar({
  hubs,
  routes,
  visibleRoutes,
  hidden,
  onToggle,
}: FilterSidebarProps) {
  const totalShipments = visibleRoutes.reduce((s, r) => s + r.shipments, 0);
  const onTimeShipments = visibleRoutes
    .filter((r) => r.status === "active")
    .reduce((s, r) => s + r.shipments, 0);
  const delayedShipments = totalShipments - onTimeShipments;
  const onTimeRate = totalShipments
    ? Math.round((onTimeShipments / totalShipments) * 100)
    : 0;
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
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent>
        <SidebarGroup className="gap-3 px-4 pt-4 pb-2">
          <dl className="grid grid-cols-2 gap-4">
            <Stat label="Shipments" value={totalShipments.toLocaleString()} />
            <Stat label="On time" value={`${onTimeRate}%`} />
          </dl>
          <div className="flex h-1 gap-0.5">
            {(
              [
                ["active", onTimeShipments],
                ["delayed", delayedShipments],
              ] as const
            )
              .filter(([, value]) => value > 0)
              .map(([status, value]) => (
                <span
                  key={status}
                  className="rounded-full"
                  style={{
                    flexGrow: value,
                    backgroundColor: statusConfig[status].color,
                  }}
                />
              ))}
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Transport Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <FilterItem
                label="Air Freight"
                count={airRouteCount}
                hidden={hidden.has("air")}
                onToggle={() => onToggle("air")}
              >
                <Plane />
              </FilterItem>
              <FilterItem
                label="Ground"
                count={groundRouteCount}
                hidden={hidden.has("ground")}
                onToggle={() => onToggle("ground")}
              >
                <Truck />
              </FilterItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(["active", "delayed"] as const).map((status) => (
                <FilterItem
                  key={status}
                  label={statusConfig[status].label}
                  count={status === "active" ? activeCount : delayedCount}
                  hidden={hidden.has(status)}
                  onToggle={() => onToggle(status)}
                >
                  <span className="flex size-4 items-center justify-center">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: statusConfig[status].color }}
                    />
                  </span>
                </FilterItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Region</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(["west", "midwest", "south", "northeast"] as const).map(
                (region) => (
                  <FilterItem
                    key={region}
                    label={regionLabels[region]}
                    count={hubs.filter((h) => h.region === region).length}
                    hidden={hidden.has(region)}
                    onToggle={() => onToggle(region)}
                  >
                    <MapPin />
                  </FilterItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-lg font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function FilterItem({
  label,
  count,
  hidden,
  onToggle,
  children,
}: {
  label: string;
  count: number;
  hidden: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <SidebarMenuItem
      className={cn("transition-opacity", hidden && "opacity-50")}
    >
      <SidebarMenuButton aria-pressed={!hidden} onClick={onToggle}>
        {children}
        <span>{label}</span>
      </SidebarMenuButton>
      <SidebarMenuBadge>{count}</SidebarMenuBadge>
    </SidebarMenuItem>
  );
}
