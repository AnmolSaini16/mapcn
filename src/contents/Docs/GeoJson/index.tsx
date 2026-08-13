import { ComponentPreview } from "../Common/ComponentPreview";
import { GeoJSONExample } from "../Common/Examples/GeoJson";
import { MapOverlayExample } from "../Common/Examples/MapOverlay";
import { DocsCode, DocsLayout, DocsSection } from "../Common/Layout";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";
import { getPreviewImages } from "@/lib/preview-images";

export function GeoJSONPage() {
  const geojsonPreview = getPreviewImages("geojson");
  const mapOverlayPreview = getPreviewImages("map-overlay");
  const geojsonSource = getExampleSource("geojson-example.tsx");
  const overlaySource = getExampleSource("map-overlay-example.tsx");

  return (
    <DocsLayout
      title="GeoJSON"
      description="Render arbitrary GeoJSON as fill and outline layers for choropleths and region maps."
      prev={{ title: "Arcs", href: "/docs/arcs" }}
      next={{ title: "Clusters", href: "/docs/clusters" }}
      toc={[
        { title: "Basic GeoJSON", slug: "basic-geojson" },
        { title: "Overlay on a Map", slug: "overlay-on-a-map" },
      ]}
    >
      <DocsSection>
        <Text className="leading-7">
          Use <DocsCode>MapGeoJSON</DocsCode> to draw polygons, lines, and
          points from a GeoJSON source as themed fill + outline layers.
        </Text>
      </DocsSection>

      <DocsSection title="Basic GeoJSON">
        <Text className="leading-7">
          Point <DocsCode>data</DocsCode> at a GeoJSON URL and the layer renders
          with a theme-aware monochrome fill and hairline outline out of the
          box, no styling required. Here it loads world map onto a{" "}
          <DocsCode>blank</DocsCode> map.
        </Text>
        <ComponentPreview
          code={geojsonSource}
          previewImage={geojsonPreview.light}
          previewImageDark={geojsonPreview.dark}
        >
          <GeoJSONExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Overlay on a Map">
        <Text className="leading-7">
          Overlay shapes and regions on a map - highlight an area, outline a
          zone, or trace a boundary.
        </Text>
        <ComponentPreview
          code={overlaySource}
          previewImage={mapOverlayPreview.light}
          previewImageDark={mapOverlayPreview.dark}
        >
          <MapOverlayExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
