"use client";

import { getNetworkSummary, statusMeta, type EdgeNode } from "../data";

import { cn } from "@/lib/utils";

interface StatusSidebarProps {
  nodes: EdgeNode[];
}

export function StatusSidebar({ nodes }: StatusSidebarProps) {
  const summary = getNetworkSummary(nodes);
  const summaryMeta = statusMeta[summary.status];

  return (
    <div className="bg-card flex w-56 shrink-0 flex-col overflow-hidden border-r">
      <div className="border-b p-3">
        <p className="text-foreground text-sm font-semibold">Edge Network</p>

        <div className="mt-2 flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", summaryMeta.dot)} />
          <span className={cn("text-xs font-medium", summaryMeta.text)}>
            {summary.label}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-background/60 rounded-md border p-2">
            <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
              Uptime
            </p>
            <p className="text-foreground text-sm font-semibold tabular-nums">
              {summary.avgUptime.toFixed(2)}%
            </p>
          </div>
          <div className="bg-background/60 rounded-md border p-2">
            <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
              Edges up
            </p>
            <p className="text-foreground text-sm font-semibold tabular-nums">
              {summary.operational}
              <span className="text-muted-foreground font-normal">
                /{summary.total}
              </span>
            </p>
          </div>
        </div>
      </div>

      <ul className="flex-1 divide-y overflow-y-auto">
        {nodes.map((node) => {
          const meta = statusMeta[node.status];

          return (
            <li
              key={node.id}
              className="flex items-center gap-2.5 px-3 py-2"
            >
              <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />

              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-xs font-medium">
                  {node.city}
                </p>
                <p className="text-muted-foreground truncate text-[10px]">
                  {node.region}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end">
                <span className="text-muted-foreground font-mono text-[10px] uppercase">
                  {node.id}
                </span>
                <span className="text-foreground font-mono text-[10px] tabular-nums">
                  {node.status === "down" ? "—" : `${node.latency}ms`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
