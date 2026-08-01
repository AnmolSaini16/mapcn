import { ScrollView, View } from "react-native";

import { getNetworkSummary, statusMeta, type EdgeNode } from "../data";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface StatusSidebarProps {
  nodes: EdgeNode[];
}

export function StatusSidebar({ nodes }: StatusSidebarProps) {
  const summary = getNetworkSummary(nodes);
  const summaryMeta = statusMeta[summary.status];

  return (
    <View className="bg-card w-56 shrink-0 flex-col overflow-hidden border-r">
      <View className="border-b p-3">
        <Text className="text-foreground text-sm font-semibold">
          Edge Network
        </Text>

        <View className="mt-2 flex-row items-center gap-1.5">
          <View className={cn("size-2 rounded-full", summaryMeta.dot)} />
          <Text className={cn("text-xs font-medium", summaryMeta.text)}>
            {summary.label}
          </Text>
        </View>

        <View className="mt-3 flex-row gap-2">
          <View className="bg-background/60 flex-1 rounded-md border p-2">
            <Text className="text-muted-foreground text-[10px] tracking-wide uppercase">
              Uptime
            </Text>
            <Text className="text-foreground text-sm font-semibold tabular-nums">
              {summary.avgUptime.toFixed(2)}%
            </Text>
          </View>
          <View className="bg-background/60 flex-1 rounded-md border p-2">
            <Text className="text-muted-foreground text-[10px] tracking-wide uppercase">
              Edges up
            </Text>
            <Text className="text-foreground text-sm font-semibold tabular-nums">
              {summary.operational}
              <Text className="text-muted-foreground font-normal">
                /{summary.total}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {nodes.map((node) => {
          const meta = statusMeta[node.status];

          return (
            <View
              key={node.id}
              className="flex-row items-center gap-2.5 border-b px-3 py-2"
            >
              <View className={cn("size-2 shrink-0 rounded-full", meta.dot)} />

              <View className="min-w-0 flex-1">
                <Text
                  className="text-foreground text-xs font-medium"
                  numberOfLines={1}
                >
                  {node.city}
                </Text>
                <Text
                  className="text-muted-foreground text-[10px]"
                  numberOfLines={1}
                >
                  {node.region}
                </Text>
              </View>

              <View className="shrink-0 items-end">
                <Text className="text-muted-foreground font-mono text-[10px] uppercase">
                  {node.id}
                </Text>
                <Text className="text-foreground font-mono text-[10px] tabular-nums">
                  {node.status === "down" ? "-" : `${node.latency}ms`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
