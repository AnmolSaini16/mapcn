import type { ReactNode } from "react";
import { View } from "react-native";

import { CodeBlock } from "../Common/CodeBlock";
import { ComponentPreview } from "../Common/ComponentPreview";
import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsSection,
} from "../Common/DocsLayout";
import { AdvancedUsageExample } from "../Common/Examples/AdvancedUsage";
import { CustomLayerExample } from "../Common/Examples/CustomLayer";
import { LayerMarkersExample } from "../Common/Examples/LayerMarkers";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

function DocsListItem({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row gap-2 pl-1">
      <Text className="leading-7">{"\u2022"}</Text>
      <Text className="flex-1 leading-0.5">{children}</Text>
    </View>
  );
}

const refCode = `import { Map, type MapRef } from "@/components/ui/map";
import { useRef } from "react";
import { View } from "react-native";

function MyMapComponent() {
  const mapRef = useRef<MapRef>(null);

  return (
    <View className="h-full w-full">
      <Map
        ref={mapRef}
        viewport={{ center: [-74, 40.7], zoom: 10 }}
        style={{ flex: 1 }}
        onPress={(event) => {
          console.log("Pressed at:", event.nativeEvent.lngLat);
        }}
      />
    </View>
  );
}`;

const mapHookCode = `import { Map, useMap } from "@/components/ui/map";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

function FlyToControl() {
  const { camera, isLoaded } = useMap();

  if (!isLoaded) return null;

  return (
    <View className="absolute top-3 left-3 z-10">
      <Button
        size="sm"
        onPress={() => {
          camera?.flyTo({
            center: [-74, 40.7],
            zoom: 12,
            duration: 1500,
          });
        }}
      >
        <Text>Fly to NYC</Text>
      </Button>
    </View>
  );
}

// Usage
<Map
  viewport={{ center: [-74, 40.7], zoom: 10 }}
  style={{ flex: 1 }}
>
  <FlyToControl />
</Map>`;

export function AdvancedUsagePage() {
  const advancedSource = getExampleSource("advanced-usage-example.tsx");
  const customLayerSource = getExampleSource("custom-layer-example.tsx");
  const layerMarkersSource = getExampleSource("layer-markers-example.tsx");

  return (
    <DocsLayout
      title="Advanced"
      description="Access the underlying MapLibre React Native instance for advanced customization."
      prev={{ title: "Clusters", href: "/docs/clusters" }}
      toc={[
        { title: "Using a Ref", slug: "using-a-ref" },
        { title: "Using the Hook", slug: "using-the-hook" },
        { title: "Example: Custom Controls", slug: "example-custom-controls" },
        {
          title: "Example: Custom GeoJSON Layer",
          slug: "example-custom-geojson-layer",
        },
        {
          title: "Example: Markers via Layers",
          slug: "example-markers-via-layers",
        },
        { title: "Extend to Build", slug: "extend-to-build" },
      ]}
    >
      <DocsSection>
        <Text className="leading-7">
          Access the underlying MapLibre React Native map and camera to use
          lower-level APIs. You can use either a <DocsCode>ref</DocsCode> on{" "}
          <DocsCode>Map</DocsCode> or the <DocsCode>useMap</DocsCode> hook.
        </Text>
      </DocsSection>

      <DocsNote>
        <Text className="font-medium">Tip:</Text> Check the{" "}
        <DocsLink
          href="https://maplibre.org/maplibre-react-native/"
          external
        >
          MapLibre React Native documentation
        </DocsLink>{" "}
        for the full list of available components, methods, and events.
      </DocsNote>

      <DocsSection title="Using a Ref">
        <Text className="leading-7">
          The simplest way to access the native map instance. Use a{" "}
          <DocsCode>ref</DocsCode> to call map methods from event handlers or
          effects.
        </Text>
        <CodeBlock code={refCode} />
      </DocsSection>

      <DocsSection title="Using the Hook">
        <Text className="leading-7">
          For child components rendered inside <DocsCode>Map</DocsCode>, use the{" "}
          <DocsCode>useMap</DocsCode> hook to access the map, camera, and
          viewport. Camera methods like <DocsCode>flyTo</DocsCode> and{" "}
          <DocsCode>easeTo</DocsCode> live on <DocsCode>camera</DocsCode>.
        </Text>
        <CodeBlock code={mapHookCode} />
      </DocsSection>

      <DocsSection title="Example: Custom Controls">
        <Text className="leading-7">
          This example shows how to create custom controls that manipulate the
          map&apos;s pitch and bearing, and read the live{" "}
          <DocsCode>viewport</DocsCode> values.
        </Text>
        <ComponentPreview code={advancedSource}>
          <AdvancedUsageExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Example: Custom GeoJSON Layer">
        <Text className="leading-7">
          Add custom GeoJSON data as layers with fill and outline styles using{" "}
          <DocsCode>GeoJSONSource</DocsCode> and <DocsCode>Layer</DocsCode>. The
          example shows NYC parks with press interactions.
        </Text>
        <ComponentPreview code={customLayerSource}>
          <CustomLayerExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Example: Markers via Layers">
        <Text className="leading-7">
          When displaying hundreds or thousands of markers, use GeoJSON circle
          layers instead of <DocsCode>MapMarker</DocsCode> components. This
          approach renders markers on the native map canvas, providing
          significantly better performance.
        </Text>
        <ComponentPreview code={layerMarkersSource}>
          <LayerMarkersExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Extend to Build">
        <Text className="leading-7">
          You can extend this to build custom features like:
        </Text>
        <View className="gap-2">
          <DocsListItem>
            <Text className="font-medium">Real-time tracking</Text> - Live
            location updates for delivery, rides, or fleet management
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Geofencing</Text> - Trigger actions
            when users enter or leave specific areas
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Heatmaps</Text> - Visualize density
            data like population, crime, or activity hotspots
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Drawing tools</Text> - Let users draw
            polygons, lines, or place markers for custom areas
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">3D buildings</Text> - Extrude building
            footprints for urban visualization
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Animations</Text> - Animate markers
            along routes or create fly-through experiences
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Custom data layers</Text> - Overlay
            weather, traffic, or satellite imagery
          </DocsListItem>
        </View>
      </DocsSection>
    </DocsLayout>
  );
}
