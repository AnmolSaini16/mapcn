import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
  DocsNote,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { AdvancedUsageExample } from "../_components/examples/advanced-usage-example";
import { CustomLayerExample } from "../_components/examples/custom-layer-example";
import { LayerMarkersExample } from "../_components/examples/layer-markers-example";
import { CodeBlock } from "../_components/code-block";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced",
};

const refCode = `import { Map, type MapRef } from "@/components/ui/map";
import { useRef } from "react";

function MyMapComponent() {
  const mapRef = useRef<MapRef>(null);

  const handleFlyTo = () => {
    // Access the MapLibre GL map instance via ref
    mapRef.current?.flyTo({ center: [-74, 40.7], zoom: 12 });
  };

  return (
    <>
      <button onClick={handleFlyTo}>Fly to NYC</button>
      <Map ref={mapRef} center={[-74, 40.7]} zoom={10} />
    </>
  );
}`;

const useMapCode = `import { Map, useMap } from "@/components/ui/map";
import { useEffect } from "react";
import type { FeatureCollection } from "geojson";
import type { MapMouseEvent } from "maplibre-gl";

// Map-wide listeners only need isLoaded; they survive style swaps.
function MapEventListener() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleClick = (e: MapMouseEvent) => {
      console.log("Clicked at:", e.lngLat);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, isLoaded]);

  return null;
}

// Custom sources/layers must recreate when styleEpoch advances.
function CustomParkLayer({ data }: { data: FeatureCollection }) {
  const { map, isLoaded, styleEpoch } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    map.addSource("parks", { type: "geojson", data });
    map.addLayer({
      id: "parks-fill",
      type: "fill",
      source: "parks",
      paint: { "fill-color": "#22c55e", "fill-opacity": 0.4 },
    });

    return () => {
      if (map.getLayer("parks-fill")) map.removeLayer("parks-fill");
      if (map.getSource("parks")) map.removeSource("parks");
    };
  }, [map, isLoaded, styleEpoch, data]);

  return null;
}

function Example({ parks }: { parks: FeatureCollection }) {
  return (
    <Map center={[-74, 40.7]} zoom={10}>
      <MapEventListener />
      <CustomParkLayer data={parks} />
    </Map>
  );
}`

export default function AdvancedPage() {
  const advancedSource = getExampleSource("advanced-usage-example.tsx");
  const customLayerSource = getExampleSource("custom-layer-example.tsx");
  const layerMarkersSource = getExampleSource("layer-markers-example.tsx");

  return (
    <DocsLayout
      title="Advanced"
      description="Access the underlying MapLibre GL instance for advanced customization."
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
        <p>
          Access the underlying MapLibre GL map instance to use any feature from
          the MapLibre GL JS API. You can use either a <DocsCode>ref</DocsCode>{" "}
          or the <DocsCode>useMap</DocsCode> hook.
        </p>
      </DocsSection>

      <DocsNote>
        <strong>Tip:</strong> Check the{" "}
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
          external
        >
          MapLibre GL JS documentation
        </DocsLink>{" "}
        for the full list of available methods and events.
      </DocsNote>

      <DocsSection title="Using a Ref">
        <p>
          The simplest way to access the map instance. Use a{" "}
          <DocsCode>ref</DocsCode> to call map methods from event handlers or
          effects.
        </p>
        <CodeBlock code={refCode} />
      </DocsSection>

      <DocsSection title="Using the Hook">
        <p>
          For child components rendered inside <DocsCode>Map</DocsCode>, use the{" "}
          <DocsCode>useMap</DocsCode> hook to access the map instance and listen
          to events. <DocsCode>styleEpoch</DocsCode> increments each time a
          basemap style becomes ready — key custom layer setup on it (and treat{" "}
          <DocsCode>isLoaded</DocsCode> as the safe-to-touch gate) so theme
          toggles recreate declarative layers without a second readiness owner.
        </p>
        <CodeBlock code={useMapCode} />
      </DocsSection>

      <DocsSection title="Example: Custom Controls">
        <p>
          This example shows how to create custom controls that manipulate the
          map&apos;s pitch and bearing, and listen to map events to display
          real-time values.
        </p>
        <ComponentPreview code={advancedSource}>
          <AdvancedUsageExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Example: Custom GeoJSON Layer">
        <p>
          Add custom GeoJSON data as layers with fill and outline styles. This
          example shows NYC parks with hover interactions.
        </p>
        <ComponentPreview code={customLayerSource}>
          <CustomLayerExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Example: Markers via Layers">
        <p>
          When displaying hundreds or thousands of markers, use GeoJSON layers
          instead of DOM-based <DocsCode>MapMarker</DocsCode> components. This
          approach renders markers on the WebGL canvas, providing significantly
          better performance.
        </p>
        <ComponentPreview code={layerMarkersSource}>
          <LayerMarkersExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Extend to Build">
        <p>You can extend this to build custom features like:</p>
        <ul>
          <li>
            <strong>Real-time tracking</strong> - Live location updates for
            delivery, rides, or fleet management
          </li>
          <li>
            <strong>Geofencing</strong> - Trigger actions when users enter or
            leave specific areas
          </li>
          <li>
            <strong>Heatmaps</strong> - Visualize density data like population,
            crime, or activity hotspots
          </li>
          <li>
            <strong>Drawing tools</strong> - Let users draw polygons, lines, or
            place markers for custom areas
          </li>
          <li>
            <strong>3D buildings</strong> - Extrude building footprints for
            urban visualization
          </li>
          <li>
            <strong>Animations</strong> - Animate markers along routes or create
            fly-through experiences
          </li>
          <li>
            <strong>Custom data layers</strong> - Overlay weather, traffic, or
            satellite imagery
          </li>
        </ul>
      </DocsSection>
    </DocsLayout>
  );
}
