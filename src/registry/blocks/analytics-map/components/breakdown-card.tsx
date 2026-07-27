"use client";

import { type BreakdownRow } from "../data";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BreakdownCardProps {
  title: string;
  rows: BreakdownRow[];
}

export function BreakdownCard({ title, rows }: BreakdownCardProps) {
  const maxRowValue =
    rows.length > 0 ? Math.max(...rows.map((row) => row.value)) : 0;

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-muted-foreground mb-2 flex items-center justify-between text-[11px] tracking-wider uppercase">
          <span>{title}</span>
          <span>Visitors</span>
        </div>
        <div className="space-y-1.5">
          {rows.map((row) => {
            const pct = maxRowValue ? (row.value / maxRowValue) * 100 : 0;
            return (
              <div
                key={row.label}
                className="relative flex items-center justify-between overflow-hidden rounded-md px-2 py-1.5 text-xs"
              >
                <div
                  className="bg-chart-2/20 absolute inset-y-0 left-0 rounded-md"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
                <span className="text-foreground/90 relative truncate pr-2">
                  {row.label}
                </span>
                <span className="text-foreground relative font-medium tabular-nums">
                  {row.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
