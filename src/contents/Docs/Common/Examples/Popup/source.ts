export const popupExampleSource = `import { Clock, ExternalLink, Navigation, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";

const places = [
  {
    id: 1,
    name: "The Metropolitan Museum of Art",
    label: "Museum",
    category: "Museum",
    rating: 4.8,
    reviews: 12453,
    hours: "10:00 AM - 5:00 PM",
    image:
      "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=300&h=200&fit=crop",
    lng: -73.9632,
    lat: 40.7794,
  },
  {
    id: 2,
    name: "Brooklyn Bridge",
    label: "Landmark",
    category: "Landmark",
    rating: 4.9,
    reviews: 8234,
    hours: "Open 24 hours",
    image:
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=300&h=200&fit=crop",
    lng: -73.9969,
    lat: 40.7061,
  },
  {
    id: 3,
    name: "Grand Central Terminal",
    label: "Transit",
    category: "Transit",
    rating: 4.7,
    reviews: 5621,
    hours: "5:15 AM - 2:00 AM",
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&h=200&fit=crop",
    lng: -73.9772,
    lat: 40.7527,
  },
];

export function PopupExample() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <View className="h-[500px] w-full">
      <Map
        viewport={{
          center: [-73.98, 40.74],
          zoom: 11,
        }}
        style={{ flex: 1 }}
      >
        {places.map((place) => (
          <MapMarker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            onClick={() => {
              setSelectedId((current) =>
                current === place.id ? null : place.id,
              );
            }}
          >
            <MarkerContent>
              <View className="size-5 rounded-full border-2 border-white bg-rose-500 shadow-lg" />
              <MarkerLabel position="bottom">{place.label}</MarkerLabel>
              {selectedId === place.id ? (
                <MarkerPopup
                  className="w-62 p-0"
                  closeButton
                  onClose={() => {
                    setSelectedId(null);
                  }}
                >
                  <View className="h-32 overflow-hidden rounded-t-md">
                    <Image
                      accessibilityLabel={place.name}
                      className="size-full"
                      resizeMode="cover"
                      source={{ uri: place.image }}
                    />
                  </View>
                  <View className="gap-2 p-3">
                    <View>
                      <Text className="text-muted-foreground pb-0.5 text-[11px] font-medium tracking-wide uppercase">
                        {place.category}
                      </Text>
                      <Text className="text-foreground leading-tight font-semibold">
                        {place.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Icon
                          as={Star}
                          className="fill-amber-400 text-amber-400"
                          size={14}
                        />
                        <Text className="font-medium">{place.rating}</Text>
                        <Text className="text-muted-foreground">
                          ({place.reviews.toLocaleString()})
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Icon
                        as={Clock}
                        className="text-muted-foreground"
                        size={14}
                      />
                      <Text className="text-muted-foreground text-sm">
                        {place.hours}
                      </Text>
                    </View>
                    <View className="flex-row gap-2 pt-1">
                      <Button
                        size="sm"
                        className="flex-1"
                      >
                        <Icon
                          as={Navigation}
                          size={14}
                        />
                        <Text>Directions</Text>
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                      >
                        <Icon
                          as={ExternalLink}
                          size={14}
                        />
                      </Button>
                    </View>
                  </View>
                </MarkerPopup>
              ) : null}
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>
    </View>
  );
}
`;
