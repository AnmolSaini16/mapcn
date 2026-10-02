import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { CircleExample } from "../_components/examples/circle-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circles",
};

export default function CirclesPage() {
  const circleSource = getExampleSource("circle-example.tsx");

  return (
    <DocsLayout
      title="Circles"
      description="Draw a disk with a real-world radius in meters."
      prev={{ title: "GeoJSON", href: "/docs/geojson" }}
      next={{ title: "Clusters", href: "/docs/clusters" }}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapCircle</DocsCode> for a search area, geofence, or
          accuracy disk. <DocsCode>center</DocsCode> is{" "}
          <DocsCode>[longitude, latitude]</DocsCode> and{" "}
          <DocsCode>radius</DocsCode> is meters.
        </p>
        <p>
          MapLibre circle layers are sized in pixels, so{" "}
          <DocsCode>MapCircle</DocsCode> builds a geodesic polygon and draws it
          with <DocsCode>MapGeoJSON</DocsCode>. The fill and outline use the
          same theme-aware defaults, and <DocsCode>fillPaint</DocsCode> /{" "}
          <DocsCode>linePaint</DocsCode> override them. Pass{" "}
          <DocsCode>false</DocsCode> to drop either layer.
        </p>
      </DocsSection>

      <DocsSection title="Search area">
        <p>A 5 km circle around San Francisco.</p>
        <ComponentPreview code={circleSource}>
          <CircleExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
