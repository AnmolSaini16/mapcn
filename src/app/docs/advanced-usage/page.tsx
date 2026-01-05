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
import { CodeBlock } from "../_components/code-block";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced Usage",
};

const refCode = `import { Map } from "@/components/ui/map";
import { useRef } from "react";
import type MapLibreGL from "maplibre-gl";

function MyMapComponent() {
  const mapRef = useRef<MapLibreGL.Map>(null);

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

// For child components inside Map, use the useMap hook
function MapEventListener() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    
    const handleClick = (e) => {
      console.log("Clicked at:", e.lngLat);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, isLoaded]);

  return null;
}

// Usage
<Map center={[-74, 40.7]} zoom={10}>
  <MapEventListener />
</Map>`;

export default function AdvancedPage() {
  const advancedSource = getExampleSource("advanced-usage-example.tsx");
  const customLayerSource = getExampleSource("custom-layer-example.tsx");

  return (
    <DocsLayout
      title="Advanced Usage"
      description="Access the underlying MapLibre GL instance for advanced customization."
      prev={{ title: "Clusters", href: "/docs/clusters" }}
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
          to events.
        </p>
        <CodeBlock code={useMapCode} />
      </DocsSection>

      <DocsSection title="Example: Custom Controls">
        <p>
          This example shows how to create custom controls that manipulate the
          map&apos;s pitch and bearing, and listen to map events to display
          real-time values.
        </p>
      </DocsSection>

      <ComponentPreview code={advancedSource}>
        <AdvancedUsageExample />
      </ComponentPreview>

      <DocsSection title="Example: Custom GeoJSON Layer">
        <p>
          Add custom GeoJSON data as layers with fill and outline styles. This
          example shows NYC parks with hover interactions.
        </p>
      </DocsSection>

      <ComponentPreview code={customLayerSource}>
        <CustomLayerExample />
      </ComponentPreview>

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
