import { View } from "react-native";

import { type BreakdownRow } from "../data";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

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
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-muted-foreground text-[11px] tracking-wider uppercase">
            {title}
          </Text>
          <Text className="text-muted-foreground text-[11px] tracking-wider uppercase">
            Visitors
          </Text>
        </View>
        <View className="gap-1.5">
          {rows.map((row) => {
            const pct = maxRowValue ? (row.value / maxRowValue) * 100 : 0;
            return (
              <View
                key={row.label}
                className="relative flex-row items-center justify-between overflow-hidden rounded-md px-2 py-1.5"
              >
                <View
                  className="bg-chart-2/20 absolute inset-y-0 left-0 rounded-md"
                  style={{ width: `${pct}%` }}
                />
                <Text
                  className="text-foreground/90 relative pr-2 text-xs"
                  numberOfLines={1}
                >
                  {row.label}
                </Text>
                <Text className="text-foreground relative text-xs font-medium tabular-nums">
                  {row.value.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      </CardContent>
    </Card>
  );
}
