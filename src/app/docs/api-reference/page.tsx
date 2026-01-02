import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
  DocsNote,
  DocsPropTable,
} from "../_components/docs";
import { CodeBlock } from "../_components/code-block";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference",
};

const anatomyCode = `<Map>
  <MapMarker longitude={...} latitude={...}>
    <MarkerContent>
      <MarkerLabel />
    </MarkerContent>
    <MarkerPopup />
    <MarkerTooltip />
  </MapMarker>

  <MapPopup longitude={...} latitude={...} />
  <MapControls />
  <MapRoute coordinates={...} />
</Map>`;

const useMapCode = `const { map, isLoaded } = useMap();`;

export default function ApiReferencePage() {
  return (
    <DocsLayout
      title="API Reference"
      description="Complete reference for all map components and their props."
      prev={{ title: "Installation", href: "/docs/installation" }}
      next={{ title: "Basic Map", href: "/docs/basic-map" }}
    >
      <DocsNote>
        <strong>Note:</strong> This library is built on top of{" "}
        <DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/" external>
          MapLibre GL JS
        </DocsLink>
        . Most components extend the native MapLibre options. Refer to the{" "}
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
          external
        >
          MapLibre Map API
        </DocsLink>{" "}
        for additional options not listed here.
      </DocsNote>

      <DocsSection title="Component Anatomy">
        <p>
          All parts of the component that you can use and combine to build your
          map.
        </p>
        <CodeBlock code={anatomyCode} showCopyButton={false} />
      </DocsSection>

      {/* Map */}
      <DocsSection title="Map">
        <p>
          The root container component that initializes MapLibre GL and provides
          context to child components. Automatically handles theme switching
          between light and dark modes.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/"
            external
          >
            MapOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>container</DocsCode> and{" "}
          <DocsCode>style</DocsCode>).
        </p>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description:
                "Child components (markers, popups, controls, routes).",
            },
            {
              name: "styles",
              type: "{ light?: string | StyleSpecification; dark?: string | StyleSpecification }",
              description:
                "Custom map styles for light and dark themes. Overrides the default Carto base map tiles.",
            },
          ]}
        />
      </DocsSection>

      {/* useMap */}
      <DocsSection title="useMap">
        <p>
          A hook that provides access to the MapLibre map instance and loading
          state. Must be used within a <DocsCode>Map</DocsCode> component.
        </p>
        <CodeBlock code={useMapCode} language="tsx" showCopyButton={false} />
        <p>
          Returns <DocsCode>map</DocsCode> (
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
            external
          >
            MapLibre.Map
          </DocsLink>
          ) and <DocsCode>isLoaded</DocsCode> (boolean) tells you if the map is
          loaded and ready to use.
        </p>
      </DocsSection>

      {/* MapControls */}
      <DocsSection title="MapControls">
        <p>
          Renders map control buttons (zoom, compass, locate, fullscreen). Must
          be used inside <DocsCode>Map</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "position",
              type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
              default: '"bottom-right"',
              description: "Position of the controls on the map.",
            },
            {
              name: "showZoom",
              type: "boolean",
              default: "true",
              description: "Show zoom in/out buttons.",
            },
            {
              name: "showCompass",
              type: "boolean",
              default: "false",
              description: "Show compass button to reset bearing.",
            },
            {
              name: "showLocate",
              type: "boolean",
              default: "false",
              description: "Show locate button to find user's location.",
            },
            {
              name: "showFullscreen",
              type: "boolean",
              default: "false",
              description: "Show fullscreen toggle button.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the controls container.",
            },
            {
              name: "onLocate",
              type: "(coords: { longitude: number; latitude: number }) => void",
              description: "Callback with user coordinates when located.",
            },
          ]}
        />
      </DocsSection>

      {/* MapMarker */}
      <DocsSection title="MapMarker">
        <p>
          A container for marker-related components. Provides context for its
          children and handles marker positioning.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/"
            external
          >
            MarkerOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>element</DocsCode>).
        </p>
        <DocsPropTable
          props={[
            {
              name: "longitude",
              type: "number",
              description: "Longitude coordinate for marker position.",
            },
            {
              name: "latitude",
              type: "number",
              description: "Latitude coordinate for marker position.",
            },
            {
              name: "children",
              type: "ReactNode",
              description:
                "Marker subcomponents (MarkerContent, MarkerPopup, etc).",
            },
            {
              name: "onClick",
              type: "(e: MouseEvent) => void",
              description: "Callback when marker is clicked.",
            },
            {
              name: "onMouseEnter",
              type: "(e: MouseEvent) => void",
              description: "Callback when mouse enters marker.",
            },
            {
              name: "onMouseLeave",
              type: "(e: MouseEvent) => void",
              description: "Callback when mouse leaves marker.",
            },
            {
              name: "onDragStart",
              type: "(lngLat: {lng, lat}) => void",
              description: "Callback when marker drag starts.",
            },
            {
              name: "onDrag",
              type: "(lngLat: {lng, lat}) => void",
              description: "Callback during marker drag.",
            },
            {
              name: "onDragEnd",
              type: "(lngLat: {lng, lat}) => void",
              description: "Callback when marker drag ends.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerContent */}
      <DocsSection title="MarkerContent">
        <p>
          Renders the visual content of a marker. Must be used inside{" "}
          <DocsCode>MapMarker</DocsCode>. If no children provided, renders a
          default blue dot marker.
        </p>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Custom marker content. Defaults to a blue dot.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the marker container.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerPopup */}
      <DocsSection title="MarkerPopup">
        <p>
          Renders a popup attached to the marker that opens on click. Must be
          used inside <DocsCode>MapMarker</DocsCode>.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
            external
          >
            PopupOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>className</DocsCode>).
        </p>
        <DocsNote>
          The <DocsCode>className</DocsCode> from MapLibre&apos;s PopupOptions
          is excluded to prevent style conflicts. Use the component&apos;s own{" "}
          <DocsCode>className</DocsCode> prop to style the popup content.
          MapLibre&apos;s default popup styles are reset via CSS.
        </DocsNote>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Popup content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the popup container.",
            },
            {
              name: "closeButton",
              type: "boolean",
              default: "false",
              description: "Show a close button in the popup.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerTooltip */}
      <DocsSection title="MarkerTooltip">
        <p>
          Renders a tooltip that appears on hover. Must be used inside{" "}
          <DocsCode>MapMarker</DocsCode>.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
            external
          >
            PopupOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>className</DocsCode>,{" "}
          <DocsCode>closeButton</DocsCode>, and{" "}
          <DocsCode>closeOnClick</DocsCode> as tooltips auto-dismiss on hover
          out).
        </p>
        <DocsNote>
          The <DocsCode>className</DocsCode> from MapLibre&apos;s PopupOptions
          is excluded to prevent style conflicts. Use the component&apos;s own{" "}
          <DocsCode>className</DocsCode> prop to style the tooltip content.
          MapLibre&apos;s default popup styles are reset via CSS.
        </DocsNote>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Tooltip content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the tooltip container.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerLabel */}
      <DocsSection title="MarkerLabel">
        <p>
          Renders a text label above or below the marker. Must be used inside{" "}
          <DocsCode>MarkerContent</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Label text content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the label.",
            },
            {
              name: "position",
              type: '"top" | "bottom"',
              default: '"top"',
              description: "Position of the label relative to the marker.",
            },
          ]}
        />
      </DocsSection>

      {/* MapPopup */}
      <DocsSection title="MapPopup">
        <p>
          A standalone popup component that can be placed anywhere on the map
          without a marker. Must be used inside <DocsCode>Map</DocsCode>.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
            external
          >
            PopupOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>className</DocsCode>).
        </p>
        <DocsNote>
          The <DocsCode>className</DocsCode> from MapLibre&apos;s PopupOptions
          is excluded to prevent style conflicts. Use the component&apos;s own{" "}
          <DocsCode>className</DocsCode> prop to style the popup content.
          MapLibre&apos;s default popup styles are reset via CSS.
        </DocsNote>
        <DocsPropTable
          props={[
            {
              name: "longitude",
              type: "number",
              description: "Longitude coordinate for popup position.",
            },
            {
              name: "latitude",
              type: "number",
              description: "Latitude coordinate for popup position.",
            },
            {
              name: "onClose",
              type: "() => void",
              description: "Callback when popup is closed.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Popup content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the popup container.",
            },
            {
              name: "closeButton",
              type: "boolean",
              default: "false",
              description: "Show a close button in the popup.",
            },
          ]}
        />
      </DocsSection>

      {/* MapRoute */}
      <DocsSection title="MapRoute">
        <p>
          Renders a line/route on the map connecting coordinate points. Must be
          used inside <DocsCode>Map</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "coordinates",
              type: "[number, number][]",
              description: "Array of [longitude, latitude] coordinate pairs.",
            },
            {
              name: "color",
              type: "string",
              default: '"#4285F4"',
              description: "Line color (CSS color value).",
            },
            {
              name: "width",
              type: "number",
              default: "3",
              description: "Line width in pixels.",
            },
            {
              name: "opacity",
              type: "number",
              default: "0.8",
              description: "Line opacity (0 to 1).",
            },
            {
              name: "dashArray",
              type: "[number, number]",
              description:
                "Dash pattern [dash length, gap length] for dashed lines.",
            },
          ]}
        />
      </DocsSection>

      {/* MapCircleArea */}
      <DocsSection title="MapCircleArea">
        <p>
          Draws a circular area on the map using a center point and radius.
          Must be used inside <DocsCode>Map</DocsCode>.
        </p>

        <DocsPropTable
          props={[
            {
              name: "center",
              type: "[number, number]",
              description:
                "Center of the circle as [longitude, latitude].",
            },
            {
              name: "radiusMeters",
              type: "number",
              description:
                "Radius of the circle in meters.",
            },
            {
              name: "fillColor",
              type: "string",
              default: '"#3b82f6"',
              description:
                "Fill color of the circle (CSS color value).",
            },
            {
              name: "fillOpacity",
              type: "number",
              default: "0.2",
              description:
                "Opacity of the circle fill (0 to 1).",
            },
            {
              name: "outlineColor",
              type: "string",
              default: '"#3b82f6"',
              description:
                "Color of the circle outline.",
            },
            {
              name: "outlineWidth",
              type: "number",
              default: "2",
              description:
                "Width of the circle outline in pixels.",
            },
            {
              name: "steps",
              type: "number",
              default: "64",
              description:
                "Number of points used to draw the circle. Higher values make the circle smoother.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
