import { Clock, MapPin, Phone, Search } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";

import type { Store } from "../data";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
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
  return (
    <View className="bg-sidebar border-sidebar-border w-80 shrink-0 border-r">
      <View className="gap-3 p-4">
        <View>
          <Text className="text-foreground text-lg font-semibold tracking-tight">
            Find a store
          </Text>
          <Text className="text-muted-foreground text-sm">
            {stores.length} {stores.length === 1 ? "location" : "locations"} near
            you
          </Text>
        </View>
        <View className="relative justify-center">
          <View className="absolute left-2.5 z-10">
            <Icon
              as={Search}
              size={16}
              className="text-muted-foreground"
            />
          </View>
          <Input
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search name or address"
            className="bg-background pl-8"
            accessibilityLabel="Search stores"
          />
        </View>
      </View>

      <View className="bg-sidebar-border h-px" />

      <ScrollView className="flex-1 p-2">
        {stores.length === 0 ? (
          <View className="p-6">
            <Text className="text-muted-foreground text-center text-sm">
              No stores match your search.
            </Text>
          </View>
        ) : (
          <View className="gap-1">
            {stores.map((store) => {
              const active = store.id === selectedId;
              return (
                <Pressable
                  key={store.id}
                  onPress={() => {
                    onSelect(store.id);
                  }}
                  accessibilityState={{ selected: active }}
                  className={cn(
                    "gap-0 rounded-md p-3",
                    active && "bg-sidebar-accent",
                  )}
                >
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="text-foreground font-medium">
                      {store.name}
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <View
                        className={cn(
                          "size-1.5 rounded-full",
                          store.openNow ? "bg-emerald-500" : "bg-neutral-500",
                        )}
                      />
                      <Text
                        className={cn(
                          "text-xs font-medium",
                          store.openNow
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {store.openNow ? "Open" : "Closed"}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-2 gap-1.5">
                    <View className="flex-row items-center gap-1.5">
                      <Icon
                        as={MapPin}
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                      <Text className="text-muted-foreground text-xs tabular-nums">
                        {store.address}, {store.neighborhood}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Icon
                        as={Clock}
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                      <Text className="text-muted-foreground text-xs tabular-nums">
                        {store.hours}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Icon
                        as={Phone}
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                      <Text className="text-muted-foreground text-xs tabular-nums">
                        {store.phone}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
