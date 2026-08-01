import { ComponentPreview } from "../Common/ComponentPreview";
import {
  DocsCode,
  DocsLayout,
  DocsNote,
  DocsSection,
} from "../Common/DocsLayout";
import { StandalonePopupExample } from "../Common/Examples/StandalonePopupExample";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

export function PopupsPage() {
  const popupSource = getExampleSource("standalone-popup-example.tsx");

  return (
    <DocsLayout
      title="Standalone Popups"
      description="Display popups anywhere on the map without markers."
      prev={{ title: "Markers", href: "/docs/markers" }}
      next={{ title: "Routes", href: "/docs/routes" }}
    >
      <DocsSection>
        <Text className="leading-7">
          Use <DocsCode>MapPopup</DocsCode> to display a popup at any location
          on the map. Unlike <DocsCode>MarkerPopup</DocsCode>, standalone popups
          are not attached to visible markers and can be controlled
          programmatically.
        </Text>
        <DocsNote>
          <Text className="font-medium">Native:</Text>{" "}
          <DocsCode>MapPopup</DocsCode> is implemented as a marker with an
          attached <DocsCode>MarkerPopup</DocsCode>. Set{" "}
          <DocsCode>closeOnClick={false}</DocsCode> when you need to dismiss the
          popup only from your own UI.
        </DocsNote>
        <ComponentPreview code={popupSource}>
          <StandalonePopupExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
