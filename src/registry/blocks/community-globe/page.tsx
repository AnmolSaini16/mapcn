"use client";

import { useMemo, useRef, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Map,
  MapControls,
  MapGeoJSON,
  MapPopup,
  type MapRef,
} from "@/registry/map";
import { MemberAvatar } from "./components/member-avatar";
import { MemberList } from "./components/member-list";
import { MemberMarker } from "./components/member-marker";
import {
  mapView,
  members,
  type Member,
  type MemberGroup,
  WORLD_GEOJSON,
} from "./data";

type Filter = "all" | "awake";

const awakeMembers = members.filter((member) => member.awake);

const GLOBE_PROJECTION = { type: "globe" };
const MARKER_SPACING_PX = 60;
const WORLD_SIZE_PX = 512;
const HIDE_COVERED_CLASS =
  "[&_.maplibregl-marker[style*='opacity:_0;']]:pointer-events-none [&_.maplibregl-popup[style*='opacity:_0;']_*]:pointer-events-none!";

export default function Page() {
  const mapRef = useRef<MapRef>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [zoom, setZoom] = useState(mapView.zoom);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleMembers = filter === "awake" ? awakeMembers : members;

  const groups = useMemo(
    () => groupMembers(visibleMembers, zoom),
    [visibleMembers, zoom],
  );

  const selected = visibleMembers.find((member) => member.id === selectedId);
  if (selectedId && !selected) setSelectedId(null);

  const handleSelect = (member: Member) => {
    setSelectedId(member.id);
    mapRef.current?.flyTo({
      center: [member.lng, member.lat],
      zoom: mapView.maxZoom,
    });
  };

  return (
    <div className="bg-background flex h-dvh flex-col-reverse md:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground flex h-1/2 shrink-0 flex-col md:h-auto md:w-72 md:border-r">
        <div className="p-3">
          <p className="text-foreground text-sm font-medium">Community</p>
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            {members.length} members, {awakeMembers.length} awake
          </p>
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as Filter)}
            className="mt-3"
          >
            <TabsList className="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="awake">Awake</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <MemberList
          members={visibleMembers}
          selectedId={selected?.id}
          onSelect={handleSelect}
        />
      </aside>

      <div className="relative min-h-0 min-w-0 flex-1">
        <Map
          ref={mapRef}
          blank
          projection={GLOBE_PROJECTION}
          center={mapView.center}
          zoom={mapView.zoom}
          minZoom={mapView.minZoom}
          maxZoom={mapView.maxZoom}
          className={HIDE_COVERED_CLASS}
          onViewportChange={(viewport) =>
            setZoom(Math.round(viewport.zoom * 2) / 2)
          }
        >
          <MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />

          {groups.map((group) => (
            <MemberMarker
              key={group.members[0].id}
              group={group}
              selectedId={selected?.id}
              onSelect={handleSelect}
            />
          ))}

          {selected && (
            <MapPopup
              key={selected.id}
              longitude={selected.lng}
              latitude={selected.lat}
              offset={20}
              closeButton
              closeOnClick={false}
              focusAfterOpen={false}
              locationOccludedOpacity={0}
              onClose={() => setSelectedId(null)}
              className="pr-8"
            >
              <div className="flex items-center gap-2.5">
                <MemberAvatar member={selected} />
                <div>
                  <p className="text-xs font-medium">{selected.name}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {selected.city}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-2 text-[11px] tabular-nums">
                {selected.localTime} local,{" "}
                {selected.awake ? "awake" : "asleep"}
              </p>
            </MapPopup>
          )}

          <MapControls />
        </Map>
      </div>
    </div>
  );
}

function groupMembers(items: Member[], zoom: number) {
  const spacing = (MARKER_SPACING_PX / (WORLD_SIZE_PX * 2 ** zoom)) * 360;
  const groups: MemberGroup[] = [];

  for (const member of items) {
    const group = groups.find(({ lng, lat }) => {
      const dx = (member.lng - lng) * Math.cos((lat * Math.PI) / 180);
      return Math.hypot(dx, member.lat - lat) < spacing;
    });

    if (!group) {
      groups.push({ lng: member.lng, lat: member.lat, members: [member] });
      continue;
    }

    const count = group.members.push(member);
    group.lng += (member.lng - group.lng) / count;
    group.lat += (member.lat - group.lat) / count;
  }

  return groups;
}
