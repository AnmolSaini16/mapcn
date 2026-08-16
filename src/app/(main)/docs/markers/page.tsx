import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsNote,
  DocsLink,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { MarkersExample } from "../_components/examples/markers-example";
import { PopupExample } from "../_components/examples/popup-example";
import { DraggableMarkerExample } from "../_components/examples/draggable-marker-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markers",
};

export default function MarkersPage() {
  const markersSource = getExampleSource("markers-example.tsx");
  const popupSource = getExampleSource("popup-example.tsx");
  const draggableMarkerSource = getExampleSource(
    "draggable-marker-example.tsx",
  );

  return (
    <DocsLayout
      title="Markers"
      description="Add interactive markers to your map with popups and tooltips."
      prev={{ title: "Controls", href: "/docs/controls" }}
      next={{ title: "Popups", href: "/docs/popups" }}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapMarker</DocsCode> to place markers on the map. Each
          marker can have custom content, popups that open on click, and
          tooltips that appear on hover.
        </p>
      </DocsSection>

      <DocsNote>
        <strong>Performance tip:</strong> <DocsCode>MapMarker</DocsCode> is
        DOM-based and works best for a few hundred markers. For larger datasets,
        see the{" "}
        <DocsLink href="/docs/advanced-usage#example-markers-via-layers">
          GeoJSON layers example
        </DocsLink>{" "}
        instead. Rendering many DOM markers can make the browser sluggish.
      </DocsNote>

      <DocsSection title="Basic Example">
        <p>
          Simple markers with tooltips and popups showing location information.
        </p>
        <ComponentPreview code={markersSource}>
          <MarkersExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Rich Popups">
        <p>
          Build complex popups with images, ratings, and action buttons using
          shadcn/ui components.
        </p>
        <ComponentPreview code={popupSource} height="500px">
          <PopupExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Draggable Marker">
        <p>
          Create draggable markers that users can move around the map. Click the
          marker to see its current coordinates in a popup.
        </p>
        <ComponentPreview code={draggableMarkerSource}>
          <DraggableMarkerExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
