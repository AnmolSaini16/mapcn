"use client";

import { Moon } from "lucide-react";

import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/registry/map";
import { mapView, type Member, type MemberGroup } from "../data";
import { MemberAvatar } from "./member-avatar";

interface MemberMarkerProps {
  group: MemberGroup;
  selectedId?: string;
  onSelect: (member: Member) => void;
}

export function MemberMarker({
  group,
  selectedId,
  onSelect,
}: MemberMarkerProps) {
  const { map } = useMap();
  const [lead] = group.members;
  const count = group.members.length;

  const handleClick = () => {
    if (!map || count === 1 || map.getZoom() >= mapView.maxZoom) {
      onSelect(lead);
      return;
    }
    map.flyTo({
      center: [group.lng, group.lat],
      zoom: Math.min(map.getZoom() + 2, mapView.maxZoom),
    });
  };

  return (
    <MapMarker
      longitude={group.lng}
      latitude={group.lat}
      opacityWhenCovered={0}
      onClick={handleClick}
    >
      <MarkerContent>
        <div className="relative transition-transform hover:scale-110">
          <MemberAvatar
            member={lead}
            alt={lead.name}
            dimmed={!lead.awake}
            className="ring-background size-9 shadow-md ring-2"
          />
          {count > 1 ? (
            <span className="bg-foreground text-background ring-background absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full text-[10px] font-medium tabular-nums ring-2">
              {count}
            </span>
          ) : (
            !lead.awake && (
              <span className="bg-background text-muted-foreground absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full">
                <Moon className="size-2.5 fill-current" />
              </span>
            )
          )}
        </div>
      </MarkerContent>
      {(count > 1 || lead.id !== selectedId) && (
        <MarkerTooltip
          offset={26}
          className="bg-popover text-popover-foreground min-w-36 border p-2"
        >
          <div className="space-y-1.5">
            {group.members.map((member) => (
              <div key={member.id} className="text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{member.name}</span>
                  {!member.awake && (
                    <Moon className="text-muted-foreground size-2.5" />
                  )}
                </div>
                <div className="text-muted-foreground mt-0.5 flex items-center justify-between gap-3">
                  <span>{member.city}</span>
                  <span className="tabular-nums">{member.localTime}</span>
                </div>
              </div>
            ))}
          </div>
        </MarkerTooltip>
      )}
    </MapMarker>
  );
}
