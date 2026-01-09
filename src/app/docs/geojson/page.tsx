import {
  DocsLayout,
  DocsSection,
  DocsCode,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { GeoJSONExample } from "../_components/examples/geojson-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeoJSON",
};

export default function GeoJSONPage() {
  const geojsonSource = getExampleSource("geojson-example.tsx");

  return (
    <DocsLayout
      title="GeoJSON"
      description="Parse and display GeoJSON strings or objects on your map."
      prev={{ title: "Clusters", href: "/docs/clusters" }}
      next={{ title: "Advanced Usage", href: "/docs/advanced-usage" }}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapGeoJSON</DocsCode> to automatically parse and display
          GeoJSON data on your map. The component accepts GeoJSON as a string or
          parsed object, and automatically handles different geometry types
          (Point, LineString, Polygon, and their Multi- variants).
        </p>
      </DocsSection>

      <DocsSection title="Basic Example">
        <p>
          Display GeoJSON features with automatic styling. The component
          automatically detects geometry types and applies appropriate styles.
          Click on features to see their properties in a popup.
        </p>
      </DocsSection>

      <ComponentPreview code={geojsonSource} className="h-[500px]">
        <GeoJSONExample />
      </ComponentPreview>

      <DocsSection title="Features">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Automatically parses GeoJSON strings or accepts parsed objects
          </li>
          <li>
            Supports all GeoJSON geometry types: Point, LineString, Polygon,
            and their Multi- variants
          </li>
          <li>
            Customizable styling for points, lines, and polygons
          </li>
          <li>
            Interactive features with click and hover callbacks
          </li>
          <li>
            Works with single Features or FeatureCollections
          </li>
        </ul>
      </DocsSection>
    </DocsLayout>
  );
}

