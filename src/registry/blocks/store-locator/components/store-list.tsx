"use client";

import { Clock, MapPin, Phone, Search } from "lucide-react-native";
import { useEffect, useRef } from "react";

import type { Store } from "../data";

import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface StoreListProps {
  stores: Store[];
  query: string;
  onQueryChange: (value: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StoreList({
  stores,
  query,
  onQueryChange,
  selectedId,
  onSelect,
}: StoreListProps) {
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!selectedId) return;
    itemRefs.current
      .get(selectedId)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-3 p-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold tracking-tight">
            Find a store
          </h2>
          <p className="text-muted-foreground text-sm">
            {stores.length} {stores.length === 1 ? "location" : "locations"}{" "}
            near you
          </p>
        </div>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
            }}
            placeholder="Search name or address"
            className="bg-background pl-8"
            aria-label="Search stores"
          />
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent>
        {stores.length === 0 ? (
          <div className="text-muted-foreground p-6 text-center text-sm">
            No stores match your search.
          </div>
        ) : (
          <SidebarGroup className="p-2">
            <SidebarMenu className="gap-1">
              {stores.map((store) => {
                const active = store.id === selectedId;
                return (
                  <SidebarMenuItem key={store.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-auto flex-col items-stretch gap-0 p-3"
                    >
                      <button
                        type="button"
                        ref={(el) => {
                          if (el) itemRefs.current.set(store.id, el);
                          else itemRefs.current.delete(store.id);
                        }}
                        onClick={() => {
                          onSelect(store.id);
                        }}
                        aria-current={active}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-foreground font-medium">
                            {store.name}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-medium",
                              store.openNow
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                store.openNow
                                  ? "bg-emerald-500"
                                  : "bg-neutral-500",
                              )}
                            />
                            {store.openNow ? "Open" : "Closed"}
                          </span>
                        </div>

                        <div className="text-muted-foreground mt-2 space-y-1.5 text-xs font-normal tabular-nums">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" />
                            {store.address}, {store.neighborhood}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock className="size-3.5 shrink-0" />
                            {store.hours}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="size-3.5 shrink-0" />
                            {store.phone}
                          </p>
                        </div>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
