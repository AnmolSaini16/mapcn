import { ComponentPreview } from "../Common/ComponentPreview";
import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsSection,
} from "../Common/DocsLayout";
import { BasicMapExample } from "../Common/Examples/BasicMapExample";
import { BlankMapExample } from "../Common/Examples/BlankMapExample";
import { ControlledMapExample } from "../Common/Examples/ControlledMapExample";
import { CustomStyleExample } from "../Common/Examples/CustomStyleExample";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

export function BasicMapPage() {
  const basicMapSource = getExampleSource("basic-map-example.tsx");
  const controlledMapSource = getExampleSource("controlled-map-example.tsx");
  const customStyleSource = getExampleSource("custom-style-example.tsx");
  const blankMapSource = getExampleSource("blank-map-example.tsx");

  return (
    <DocsLayout
      title="Map"
      description="The simplest way to add an interactive map to your React Native app."
      prev={{ title: "API Reference", href: "/docs/api-reference" }}
      next={{ title: "Controls", href: "/docs/controls" }}
      toc={[
        { title: "Basic Usage", slug: "basic-usage" },
        { title: "Controlled Mode", slug: "controlled-mode" },
        { title: "Blank Basemap", slug: "blank-basemap" },
        { title: "Custom Styles", slug: "custom-styles" },
      ]}
    >
      <DocsSection title="Basic Usage">
        <Text className="leading-7">
          The <DocsCode>Map</DocsCode> component handles MapLibre React Native
          setup, theming from the device color scheme, and provides context for
          child components. Give the map a sized container - native maps need an
          explicit height.
        </Text>
        <ComponentPreview code={basicMapSource}>
          <BasicMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Controlled Mode">
        <Text className="leading-7">
          Use the <DocsCode>viewport</DocsCode> and{" "}
          <DocsCode>onViewportChange</DocsCode> props to control the map&apos;s
          viewport externally. This is useful when you need to sync the map
          state with your application or respond to viewport changes.
        </Text>
        <ComponentPreview code={controlledMapSource}>
          <ControlledMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Blank Basemap">
        <Text className="leading-7">
          The <DocsCode>blank</DocsCode> prop swaps the default street basemap
          for a transparent, tile-less canvas - perfect for data visualizations
          where you draw your own layers instead of showing streets and labels.
        </Text>
        <DocsNote>
          <Text className="font-medium">Note:</Text> <DocsCode>blank</DocsCode>{" "}
          is a blank canvas. Used alone, <DocsCode>{"<Map blank />"}</DocsCode>{" "}
          renders nothing - you must add your own layers on top (e.g.{" "}
          <DocsCode>MapGeoJSON</DocsCode>, <DocsCode>MapArc</DocsCode>, or
          markers). See <DocsLink href="/docs/geojson">GeoJSON</DocsLink> for
          more on rendering shapes on a blank map.
        </DocsNote>
        <Text className="leading-7">
          Here, a <DocsCode>MapGeoJSON</DocsCode> layer renders world country
          borders on top of the transparent canvas.
        </Text>
        <ComponentPreview code={blankMapSource}>
          <BlankMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Custom Styles">
        <Text className="leading-7">
          Use the <DocsCode>styles</DocsCode> prop to provide custom map styles
          for light and dark themes. This example uses free vector tiles from{" "}
          <DocsLink
            href="https://openfreemap.org"
            external
          >
            OpenFreeMap
          </DocsLink>
          , an open-source project - the data comes from OpenStreetMap. Pitch
          animation uses the <DocsCode>camera</DocsCode> from{" "}
          <DocsCode>useMap</DocsCode>.
        </Text>
        <ComponentPreview code={customStyleSource}>
          <CustomStyleExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
