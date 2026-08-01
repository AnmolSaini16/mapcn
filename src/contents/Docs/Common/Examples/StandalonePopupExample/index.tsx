import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Map, MapPopup } from "@/registry/map";

export function StandalonePopupExample() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <View className="relative h-full w-full">
      <Map
        viewport={{
          center: [-74.006, 40.7128],
          zoom: 13,
        }}
        style={{ flex: 1 }}
      >
        {showPopup ? (
          <MapPopup
            longitude={-74.006}
            latitude={40.7128}
            onClose={() => {
              setShowPopup(false);
            }}
            closeButton
            closeOnClick={false}
          >
            <View className="gap-2">
              <Text className="text-foreground font-semibold">
                New York City
              </Text>
              <Text className="text-muted-foreground text-sm">
                The city that never sleeps. Population: 8.3 million
              </Text>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onPress={() => {
                  setShowPopup(false);
                }}
              >
                <Text>Close</Text>
              </Button>
            </View>
          </MapPopup>
        ) : null}
      </Map>

      {!showPopup ? (
        <View
          className="absolute bottom-4 left-4 z-10"
          pointerEvents="box-none"
        >
          <Button
            size="sm"
            onPress={() => {
              setShowPopup(true);
            }}
          >
            <Text>Show Popup</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
}
