import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
  DocsNote,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { BasicMapExample } from "../_components/examples/basic-map-example";
import { ControlledMapExample } from "../_components/examples/controlled-map-example";
import { CustomStyleExample } from "../_components/examples/custom-style-example";
import { BlankMapExample } from "../_components/examples/blank-map-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map",
};

export default function BasicMapPage() {
  const basicMapSource = getExampleSource("basic-map-example.tsx");
  const controlledMapSource = getExampleSource("controlled-map-example.tsx");
  const customStyleSource = getExampleSource("custom-style-example.tsx");
  const blankMapSource = getExampleSource("blank-map-example.tsx");

  return (
    <DocsLayout
      title="Map"
      description="The simplest way to add an interactive map to your application."
      prev={{ title: "API Reference", href: "/docs/api-reference" }}
      next={{ title: "Controls", href: "/docs/controls" }}
    >
      <DocsSection title="Basic Usage">
        <p>
          The <DocsCode>Map</DocsCode> component handles MapLibre GL setup,
          theming, and provides context for child components.
        </p>
        <ComponentPreview code={basicMapSource}>
          <BasicMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Controlled Mode">
        <p>
          Use the <DocsCode>viewport</DocsCode> and{" "}
          <DocsCode>onViewportChange</DocsCode> props to control the map&apos;s
          viewport externally. This is useful when you need to sync the map
          state with your application or respond to viewport changes.
        </p>
        <ComponentPreview code={controlledMapSource}>
          <ControlledMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Blank Basemap">
        <p>
          The <DocsCode>blank</DocsCode> prop swaps the default street basemap
          for a transparent, tile-less canvas - perfect for data visualizations
          where you draw your own layers instead of showing streets and labels.
        </p>
        <DocsNote>
          <strong>Note:</strong> <DocsCode>blank</DocsCode> is a blank canvas.
          Used alone, <DocsCode>{"<Map blank />"}</DocsCode> renders nothing -
          you must add your own layers on top (e.g.{" "}
          <DocsCode>MapGeoJSON</DocsCode>, <DocsCode>MapArc</DocsCode>, or
          markers). See <DocsLink href="/docs/geojson">GeoJSON</DocsLink> for
          more on rendering shapes on a blank map.
        </DocsNote>
        <p>
          Here, a <DocsCode>MapGeoJSON</DocsCode> layer renders world country
          borders on top of the transparent canvas.
        </p>
        <ComponentPreview code={blankMapSource}>
          <BlankMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Custom Styles">
        <p>
          Use the <DocsCode>styles</DocsCode> prop to provide custom map styles.
          This example uses free vector tiles from{" "}
          <DocsLink href="https://openfreemap.org" external>
            OpenFreeMap
          </DocsLink>
          , an open-source project, the data comes from OpenStreetMap.
        </p>
        <ComponentPreview code={customStyleSource}>
          <CustomStyleExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
