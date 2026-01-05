import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { CircularAreaHighlightExample } from "../_components/examples/circular-area-highlight-example";
import { GeoFenceExample } from "../_components/examples/geofence-location-tracker-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circular Area",
};

export default function CircleHighlightPage() {
  const circularAreaHighlightSource = getExampleSource(
    "circular-area-highlight-example.tsx"
  );
  const geoFenceLocationTrackerSource = getExampleSource(
    "geofence-location-tracker-example.tsx"
  );

  return (
    <DocsLayout
      title="Highlighted Circular Area"
      description="Highlight a circular area on the map using a center point and radius."
      prev={{ title: "Routes", href: "/docs/routes" }}
      next={{ title: "Clusters", href: "/docs/clusters" }}      
    >
      <DocsSection>
        <p>
          The <DocsCode>MapCircleArea</DocsCode> component is used to visually
          highlight a circular region on the map. It is useful for showing
          coverage areas, search radius, geofencing zones, or distance-based
          highlights.
        </p>
        <p>
          You define the circle by providing a center coordinate and a radius in
          meters. The circle is rendered as a filled area with an optional
          outline.
        </p>
      </DocsSection>

      <DocsSection title="Basic Circular Area Highlight">
        <p>Highlight a circular area on the map using a center point and radius.</p>
      </DocsSection>

      <ComponentPreview code={circularAreaHighlightSource}>
        <CircularAreaHighlightExample />
      </ComponentPreview>

      <DocsSection title="User Location Tracking">
        <p>
          Displays and tracks the user’s current location on the map. 
          Indicates whether the user is inside or outside a predefined area (geofence), 
          and updates the map view and marker accordingly when the user clicks the Locate button.
        </p>
      </DocsSection>

      <ComponentPreview code={geoFenceLocationTrackerSource}>
        <GeoFenceExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
