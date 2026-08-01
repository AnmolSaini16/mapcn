import { ComponentPreview } from "../Common/ComponentPreview";
import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsSection,
} from "../Common/DocsLayout";
import { DraggableMarkerExample } from "../Common/Examples/DraggableMarker";
import { MarkersExample } from "../Common/Examples/Markers";
import { PopupExample } from "../Common/Examples/Popup";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

export function MarkersPage() {
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
      toc={[
        { title: "Basic Example", slug: "basic-example" },
        { title: "Rich Popups", slug: "rich-popups" },
        { title: "Draggable Marker", slug: "draggable-marker" },
      ]}
    >
      <DocsSection>
        <Text className="leading-7">
          Use <DocsCode>MapMarker</DocsCode> to place markers on the map. Each
          marker can have custom content, popups that open on press, and
          tooltips that appear on press (and pointer hover where available).
        </Text>
      </DocsSection>

      <DocsNote>
        <Text className="font-medium">Performance tip:</Text>{" "}
        <DocsCode>MapMarker</DocsCode> renders native view annotations and works
        best for dozens to a few hundred points. For larger datasets, use{" "}
        <DocsCode>MapGeoJSON</DocsCode> or symbol layers - see{" "}
        <DocsLink href="/docs/geojson">GeoJSON</DocsLink>.
      </DocsNote>

      <DocsSection title="Basic Example">
        <Text className="leading-7">
          Simple markers with tooltips and popups showing location information.
        </Text>
        <ComponentPreview code={markersSource}>
          <MarkersExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Rich Popups">
        <Text className="leading-7">
          Build complex popups with images, ratings, and action buttons using
          React Native Reusables components.
        </Text>
        <ComponentPreview
          code={popupSource}
          className="h-[500px]"
        >
          <PopupExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Draggable Marker">
        <Text className="leading-7">
          Create draggable markers that users can move around the map. Press the
          marker to see its current coordinates in a popup.
        </Text>
        <DocsNote>
          <Text className="font-medium">Native:</Text> On iOS, long-press the
          marker before dragging - a regular pan still moves the map. Persist
          the new position with <DocsCode>onDragEnd</DocsCode> (native only
          commits coordinates when the drag ends).{" "}
          <DocsCode>draggable</DocsCode> markers use MapLibre{" "}
          <DocsCode>ViewAnnotation</DocsCode> under the hood.
        </DocsNote>
        <ComponentPreview code={draggableMarkerSource}>
          <DraggableMarkerExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
