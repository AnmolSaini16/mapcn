"use client";

import { Clock, MapPin, Phone } from "lucide-react-native";
import { useEffect } from "react";

import type { Store } from "../data";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Map,
  MapControls,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/registry/map";

interface LocatorMapProps {
  stores: Store[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  center: [number, number];
}

function FlyToSelected({ store }: { store?: Store }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !store) return;
    map.flyTo({
      center: [store.lng, store.lat],
      zoom: 14,
      duration: 800,
      essential: true,
    });
  }, [map, store]);

  return null;
}

function StorePin({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "text-background flex items-center justify-center rounded-full shadow-md transition-all",
        active
          ? "bg-foreground/80 size-9 scale-110"
          : "bg-foreground hover:bg-muted-foreground size-7",
      )}
    >
      <MapPin className={cn(active ? "size-4.5" : "size-3.5")} />
    </div>
  );
}

export function LocatorMap({
  stores,
  selectedId,
  onSelect,
  onClearSelection,
  center,
}: LocatorMapProps) {
  const selected = stores.find((store) => store.id === selectedId);

  return (
    <div className="relative h-full">
      <SidebarTrigger className="bg-background absolute top-3 left-3 z-10 border shadow-sm md:hidden" />

      <Map
        center={center}
        zoom={12}
        minZoom={10}
        maxZoom={17}
      >
        <MapControls
          showFullscreen
          showCompass
        />
        <FlyToSelected store={selected} />

        {stores.map((store) => (
          <MapMarker
            key={store.id}
            longitude={store.lng}
            latitude={store.lat}
            onClick={() => {
              onSelect(store.id);
            }}
          >
            <MarkerContent>
              <StorePin active={store.id === selectedId} />
            </MarkerContent>
            <MarkerTooltip
              offset={24}
              className="bg-foreground text-background"
            >
              {store.name}
            </MarkerTooltip>
          </MapMarker>
        ))}

        {selected && (
          <MapPopup
            longitude={selected.lng}
            latitude={selected.lat}
            offset={26}
            closeButton
            closeOnClick={false}
            onClose={onClearSelection}
            className="min-w-56"
            focusAfterOpen={false}
          >
            <p className="text-popover-foreground pr-5 font-medium">
              {selected.name}
            </p>
            <span
              className={cn(
                "mt-1 flex items-center gap-1.5 text-xs font-medium",
                selected.openNow ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  selected.openNow ? "bg-emerald-500" : "bg-neutral-500",
                )}
              />
              {selected.openNow ? "Open now" : "Closed"}
            </span>

            <div className="text-muted-foreground mt-2.5 space-y-1.5 text-xs tabular-nums">
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                {selected.address}, {selected.neighborhood}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0" />
                {selected.hours}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="size-3.5 shrink-0" />
                {selected.phone}
              </p>
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  );
}
