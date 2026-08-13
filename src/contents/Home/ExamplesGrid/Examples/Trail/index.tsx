import { Bike } from "lucide-react-native";
import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { getPreviewImages } from "@/lib/preview-images";
import { MapMarker, MapRoute, MarkerContent } from "@/registry/map";

const trailPreview = getPreviewImages("home-trail");

const trailCoordinates: [number, number][] = [
  [-73.95846730810143, 40.80035246904919],
  [-73.9717593682683, 40.78210942124929],
  [-73.98192123136191, 40.76793032580281],
  [-73.97393759456651, 40.76462909128966],
  [-73.97291537521572, 40.765159628993814],
  [-73.96920618484948, 40.7637106622374],
  [-73.96383691302509, 40.77117117897504],
  [-73.9584024523858, 40.76889223221369],
  [-73.9470773638119, 40.784238113060894],
  [-73.95585246901248, 40.78786547226602],
  [-73.94937945594087, 40.79668351998197],
  [-73.9498273526222, 40.797167598041455],
  [-73.95699644240298, 40.80016017872583],
];
const start = trailCoordinates[0];
const end = trailCoordinates[trailCoordinates.length - 1];

export function TrailExample() {
  return (
    <ExampleCard
      className="aspect-square min-h-[280px]"
      previewImage={trailPreview.light}
      previewImageDark={trailPreview.dark}
    >
      <View className="bg-background/95 border-border absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg">
        <View className="mb-2 flex-row items-center gap-1.5">
          <Icon
            as={Bike}
            className="text-foreground size-3.5"
          />
          <Text className="text-xs font-medium">Central Park Loop</Text>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1 items-center">
            <Text className="text-sm font-semibold">6.2</Text>
            <Text className="text-muted-foreground text-[9px] uppercase">
              Miles
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-sm font-semibold">32</Text>
            <Text className="text-muted-foreground text-[9px] uppercase">
              Mins
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-sm font-semibold">285</Text>
            <Text className="text-muted-foreground text-[9px] uppercase">
              Cal
            </Text>
          </View>
        </View>
      </View>

      <ExampleMap
        viewport={{
          center: [-73.97, 40.782],
          zoom: 11.8,
          bearing: 0,
          pitch: 0,
        }}
      >
        <MapRoute
          coordinates={trailCoordinates}
          color="#3b82f6"
          width={3}
          opacity={0.9}
        />

        <MapMarker
          longitude={start[0]}
          latitude={start[1]}
        >
          <MarkerContent>
            <View className="size-3 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
          </MarkerContent>
        </MapMarker>

        <MapMarker
          longitude={end[0]}
          latitude={end[1]}
        >
          <MarkerContent>
            <View className="size-3 rounded-full border-2 border-white bg-red-500 shadow-lg" />
          </MarkerContent>
        </MapMarker>
      </ExampleMap>
    </ExampleCard>
  );
}
