import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { GeoJSONExample } from "../_components/examples/geojson-example";
import { MapOverlayExample } from "../_components/examples/map-overlay-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeoJSON",
};

export default function GeoJSONPage() {
  const geojsonSource = getExampleSource("geojson-example.tsx");
  const overlaySource = getExampleSource("map-overlay-example.tsx");

  return (
    <DocsLayout
      title="GeoJSON"
      description="Render arbitrary GeoJSON as fill and outline layers for choropleths and region maps."
      prev={{ title: "Arcs", href: "/docs/arcs" }}
      next={{ title: "Clusters", href: "/docs/clusters" }}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapGeoJSON</DocsCode> to draw polygons, lines, and
          points from a GeoJSON source as themed fill + outline layers.
        </p>
      </DocsSection>

      <DocsSection title="Basic GeoJSON">
        <p>
          Point <DocsCode>data</DocsCode> at a GeoJSON URL and the layer renders
          with a theme-aware monochrome fill and hairline outline out of the
          box, no styling required. Here it loads world map onto a{" "}
          <DocsCode>blank</DocsCode> map.
        </p>
        <ComponentPreview code={geojsonSource}>
          <GeoJSONExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Overlay on a Map">
        <p>
          Overlay shapes and regions on a map - highlight an area, outline a
          zone, or trace a boundary.
        </p>
        <ComponentPreview code={overlaySource}>
          <MapOverlayExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
