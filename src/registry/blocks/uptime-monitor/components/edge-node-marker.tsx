"use client";

import { statusMeta, type EdgeNode } from "../data";

import { cn } from "@/lib/utils";
import { MapMarker, MarkerContent, MarkerTooltip } from "@/registry/map";

interface EdgeNodeMarkerProps {
  node: EdgeNode;
}

export function EdgeNodeMarker({ node }: EdgeNodeMarkerProps) {
  const meta = statusMeta[node.status];

  return (
    <MapMarker
      longitude={node.lng}
      latitude={node.lat}
    >
      <MarkerContent>
        <div className="group flex size-4 items-center justify-center">
          <span
            className={cn(
              "inline-flex size-2 rounded-full transition-transform group-hover:scale-125",
              meta.dot,
            )}
          />
        </div>
      </MarkerContent>
      <MarkerTooltip
        offset={10}
        className="bg-popover text-popover-foreground min-w-28 border p-2"
      >
        <div className="flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full", meta.dot)} />
          <span className="text-[11px] font-medium">{node.city}</span>
          <span className="text-muted-foreground ml-auto font-mono text-[11px] uppercase">
            {node.id}
          </span>
        </div>
        <div className="text-muted-foreground mt-1.5 flex items-center justify-between gap-3 text-[11px]">
          <span>{node.status === "down" ? "—" : `${node.latency} ms`}</span>
          <span className="tabular-nums">{node.uptime.toFixed(2)}%</span>
        </div>
      </MarkerTooltip>
    </MapMarker>
  );
}
