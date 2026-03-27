import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { BasicMapExample } from "../_components/examples/basic-map-example";
import { ControlledMapExample } from "../_components/examples/controlled-map-example";
import { CustomStyleExample } from "../_components/examples/custom-style-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map",
};

export default function BasicMapPage() {
  const basicMapSource = getExampleSource("basic-map-example.tsx");
  const controlledMapSource = getExampleSource("controlled-map-example.tsx");
  const customStyleSource = getExampleSource("custom-style-example.tsx");

  return (
    <DocsLayout
      title="Map"
      description="The simplest way to add an interactive map to your application."
      prev={{ title: "API Reference", href: "/docs/api-reference" }}
      next={{ title: "Controls", href: "/docs/controls" }}
      toc={[
        { title: "Basic Usage", slug: "basic-usage" },
        { title: "Controlled Mode", slug: "controlled-mode" },
        { title: "Custom Styles", slug: "custom-styles" },
      ]}
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

      <DocsSection title="Custom Styles">
        <p>
          Use the <DocsCode>styles</DocsCode> prop to provide custom map styles.
          This example shows additional{" "}
          <DocsLink href="https://maps.guru" external>
            maps.guru
          </DocsLink>{" "}
          style variants beyond the default light/dark themes.
        </p>
        <ComponentPreview code={customStyleSource}>
          <CustomStyleExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
