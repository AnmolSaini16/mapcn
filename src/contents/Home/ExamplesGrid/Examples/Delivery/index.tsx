import { Truck } from "lucide-react-native";
import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
} from "@/registry/map";

const store = { lng: -0.14, lat: 51.5154 };
const home = { lng: -0.07, lat: 51.51 };

const route: [number, number][] = [
  [-0.14, 51.5155],
  [-0.1418, 51.5153],
  [-0.1417, 51.5145],
  [-0.1414, 51.514],
  [-0.1407, 51.5133],
  [-0.1398, 51.5122],
  [-0.1393, 51.5117],
  [-0.1388, 51.5111],
  [-0.1381, 51.5103],
  [-0.1376, 51.5101],
  [-0.1364, 51.5099],
  [-0.136, 51.5099],
  [-0.1354, 51.5101],
  [-0.1348, 51.5101],
  [-0.134, 51.51],
  [-0.1333, 51.5101],
  [-0.1326, 51.5094],
  [-0.1319, 51.5086],
  [-0.1311, 51.5078],
  [-0.1301, 51.508],
  [-0.1292, 51.5083],
  [-0.129, 51.5082],
  [-0.1286, 51.5075],
  [-0.128, 51.5075],
  [-0.1275, 51.5076],
  [-0.1272, 51.5074],
  [-0.1255, 51.507],
  [-0.1233, 51.5067],
  [-0.1226, 51.5066],
  [-0.1219, 51.5072],
  [-0.1208, 51.5084],
  [-0.1193, 51.5094],
  [-0.1187, 51.5097],
  [-0.1165, 51.5104],
  [-0.1154, 51.5107],
  [-0.1135, 51.5109],
  [-0.112, 51.511],
  [-0.1082, 51.511],
  [-0.1072, 51.511],
  [-0.1035, 51.511],
  [-0.1015, 51.5112],
  [-0.0958, 51.5112],
  [-0.0932, 51.5109],
  [-0.0912, 51.5105],
  [-0.0903, 51.5103],
  [-0.0896, 51.5102],
  [-0.0883, 51.5099],
  [-0.0871, 51.5097],
  [-0.0838, 51.5093],
  [-0.0818, 51.5091],
  [-0.0805, 51.5094],
  [-0.0797, 51.5096],
  [-0.0782, 51.5095],
  [-0.0768, 51.5095],
  [-0.0755, 51.5097],
  [-0.0748, 51.5099],
  [-0.0741, 51.5098],
  [-0.0736, 51.5093],
  [-0.0732, 51.5089],
  [-0.0715, 51.5084],
  [-0.0709, 51.5083],
  [-0.0705, 51.5091],
  [-0.0696, 51.5094],
  [-0.0699, 51.51],
];

const truckPosition = route[Math.floor(route.length * 0.6)];

export function DeliveryExample() {
  return (
    <ExampleCard
      className="aspect-square min-h-[280px]"
      previewImage="/images/previews/home-delivery.png"
    >
      <ExampleMap
        viewport={{
          center: [-0.105, 51.511],
          zoom: 12.6,
          bearing: 0,
          pitch: 0,
        }}
      >
        <MapRoute
          coordinates={route}
          width={4}
          color="#3b82f6"
        />
        <MapMarker
          longitude={store.lng}
          latitude={store.lat}
        >
          <MarkerContent>
            <View className="size-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
            <MarkerLabel>
              <Text className="text-[10px] font-medium">Store</Text>
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>
        <MapMarker
          longitude={truckPosition[0]}
          latitude={truckPosition[1]}
        >
          <MarkerContent>
            <View className="rounded-full bg-blue-500 p-1.5 shadow-lg">
              <Icon
                as={Truck}
                className="size-3 text-white"
              />
            </View>
            <MarkerTooltip>
              <Text className="text-xs">On the way</Text>
            </MarkerTooltip>
          </MarkerContent>
        </MapMarker>
        <MapMarker
          longitude={home.lng}
          latitude={home.lat}
        >
          <MarkerContent>
            <View className="size-3.5 rounded-full border-2 border-white bg-red-500 shadow-lg" />
            <MarkerLabel>
              <Text className="text-[10px] font-medium">Home</Text>
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </ExampleMap>
    </ExampleCard>
  );
}
