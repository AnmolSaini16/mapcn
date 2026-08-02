import { MapPin } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Map, MapMarker, MarkerContent, MarkerPopup } from "@/registry/map";

export function DraggableMarkerExample() {
  const [draggableMarker, setDraggableMarker] = useState({
    lng: -73.98,
    lat: 40.75,
  });
  const [showPopup, setShowPopup] = useState(false);

  return (
    <View className="h-full w-full">
      <Map
        viewport={{
          center: [-73.98, 40.75],
          zoom: 12,
        }}
        style={{ flex: 1 }}
      >
        <MapMarker
          draggable
          longitude={draggableMarker.lng}
          latitude={draggableMarker.lat}
          onClick={(event) => {
            const lngLat = event.nativeEvent.lngLat;
            setDraggableMarker({ lng: lngLat[0], lat: lngLat[1] });
            setShowPopup((current) => !current);
          }}
          onDragEnd={(lngLat) => {
            setDraggableMarker({ lng: lngLat.lng, lat: lngLat.lat });
          }}
        >
          <MarkerContent>
            <Icon
              as={MapPin}
              className="fill-foreground stroke-background"
              size={28}
            />
            {showPopup ? (
              <MarkerPopup
                closeButton
                onClose={() => {
                  setShowPopup(false);
                }}
              >
                <View className="gap-1 pr-3">
                  <Text className="text-foreground font-medium">
                    Coordinates
                  </Text>
                  <Text className="text-muted-foreground text-xs tabular-nums">
                    {draggableMarker.lat.toFixed(4)},{" "}
                    {draggableMarker.lng.toFixed(4)}
                  </Text>
                </View>
              </MarkerPopup>
            ) : null}
          </MarkerContent>
        </MapMarker>
      </Map>
    </View>
  );
}
