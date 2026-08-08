import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MapMarker, MarkerContent, useMap } from "@/registry/map";

const destinations = [
  { name: "New York", center: [-74.006, 40.7128] as [number, number] },
  { name: "London", center: [-0.1276, 51.5074] as [number, number] },
  { name: "Tokyo", center: [139.6917, 35.6895] as [number, number] },
  { name: "Sydney", center: [151.2093, -33.8688] as [number, number] },
];

function FlyToAnimator({ center }: { center: [number, number] }) {
  const { camera } = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    camera?.flyTo({
      center,
      zoom: 6,
      duration: 2000,
    });
  }, [camera, center]);

  return null;
}

export function FlyToExample() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = destinations[activeIndex];

  return (
    <ExampleCard
      className="aspect-square min-h-[280px]"
      previewImage="/images/previews/home-fly-to.png"
    >
      <ExampleMap
        viewport={{
          center: destinations[0].center,
          zoom: 5.5,
          bearing: 0,
          pitch: 0,
        }}
      >
        <FlyToAnimator center={active.center} />
        <MapMarker
          longitude={active.center[0]}
          latitude={active.center[1]}
        >
          <MarkerContent>
            <View className="items-center justify-center">
              <View className="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
            </View>
          </MarkerContent>
        </MapMarker>
      </ExampleMap>

      <View className="absolute inset-x-3 top-3 flex-row flex-wrap gap-1.5">
        {destinations.map((dest, index) => (
          <Button
            key={dest.name}
            size="sm"
            variant={index === activeIndex ? "default" : "secondary"}
            onPress={() => {
              setActiveIndex(index);
            }}
            className="h-7 rounded-full border px-2.5"
          >
            <Text>{dest.name}</Text>
          </Button>
        ))}
      </View>
    </ExampleCard>
  );
}
