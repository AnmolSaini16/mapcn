import { View } from "react-native";

import { statusMeta, type EdgeNode } from "../data";

import { Text } from "@/components/ui/text";
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
        <View className="size-4 items-center justify-center">
          <View className={cn("size-2 rounded-full", meta.dot)} />
        </View>
      </MarkerContent>
      <MarkerTooltip className="bg-popover border-border min-w-28 border p-2">
        <View className="flex-row items-center gap-1.5">
          <View className={cn("size-1.5 rounded-full", meta.dot)} />
          <Text className="text-[11px] font-medium">{node.city}</Text>
          <Text className="text-muted-foreground ml-auto font-mono text-[11px] uppercase">
            {node.id}
          </Text>
        </View>
        <View className="mt-1.5 flex-row items-center justify-between gap-3">
          <Text className="text-muted-foreground text-[11px]">
            {node.status === "down" ? "-" : `${node.latency} ms`}
          </Text>
          <Text className="text-muted-foreground text-[11px] tabular-nums">
            {node.uptime.toFixed(2)}%
          </Text>
        </View>
      </MarkerTooltip>
    </MapMarker>
  );
}
