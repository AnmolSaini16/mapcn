import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { MarkersExample } from "../_components/examples/markers-example";
import { PopupExample } from "../_components/examples/popup-example";
import { DraggableMarkerExample } from "../_components/examples/draggable-marker-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markers",
};

export default function MarkersPage() {
  const markersSource = getExampleSource("markers-example.tsx");
  const popupSource = getExampleSource("popup-example.tsx");
  const draggableMarkerSource = getExampleSource("draggable-marker-example.tsx");

  return (
    <DocsLayout
      title="Markers"
      description="Add interactive markers to your map with popups and tooltips."
      prev={{ title: "Map Controls", href: "/docs/controls" }}
      next={{ title: "Popups", href: "/docs/popups" }}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapMarker</DocsCode> to place markers on the map. Each
          marker can have custom content, popups that open on click, and
          tooltips that appear on hover.
        </p>
      </DocsSection>

      <DocsSection title="Basic Example">
        <p>
          Simple markers with tooltips and popups showing location information.
        </p>
      </DocsSection>

      <ComponentPreview code={markersSource}>
        <MarkersExample />
      </ComponentPreview>

      <DocsSection title="Rich Popups">
        <p>
          Build complex popups with images, ratings, and action buttons using
          shadcn/ui components.
        </p>
      </DocsSection>

      <ComponentPreview code={popupSource} className="h-[500px]">
        <PopupExample />
      </ComponentPreview>

      <DocsSection title="Draggable Marker">
        <p>
          Create draggable markers that users can move around the map. Click the
          marker to see its current coordinates in a popup.
        </p>
      </DocsSection>

      <ComponentPreview code={draggableMarkerSource}>
        <DraggableMarkerExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
