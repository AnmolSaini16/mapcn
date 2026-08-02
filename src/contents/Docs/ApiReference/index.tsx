import { CodeBlock } from "../Common/CodeBlock";
import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsPropTable,
  DocsSection,
} from "../Common/Layout";

import {
  mapArcProps,
  mapClusterLayerProps,
  mapControlsProps,
  mapGeoJSONProps,
  mapMarkerProps,
  mapPopupProps,
  mapProps,
  mapRouteProps,
  markerContentProps,
  markerLabelProps,
  markerPopupProps,
  markerTooltipProps,
} from "./props";

import { Text } from "@/components/ui/text";

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
  <MapArc data={...} />
  <MapGeoJSON data={...} />
  <MapClusterLayer data={...} />
</Map>`;

const mapHookExample = `const { map, camera, isLoaded, viewport, resolvedTheme } = useMap();`;

export function ApiReferencePage() {
  return (
    <DocsLayout
      title="API Reference"
      description="Complete reference for all map components and their props."
      prev={{ title: "Installation", href: "/docs/installation" }}
      next={{ title: "Map", href: "/docs/basic-map" }}
      toc={[
        { title: "Component Anatomy", slug: "component-anatomy" },
        { title: "Map", slug: "map" },
        { title: "useMap", slug: "usemap" },
        { title: "MapControls", slug: "mapcontrols" },
        { title: "MapMarker", slug: "mapmarker" },
        { title: "MarkerContent", slug: "markercontent" },
        { title: "MarkerPopup", slug: "markerpopup" },
        { title: "MarkerTooltip", slug: "markertooltip" },
        { title: "MarkerLabel", slug: "markerlabel" },
        { title: "MapPopup", slug: "mappopup" },
        { title: "MapRoute", slug: "maproute" },
        { title: "MapArc", slug: "maparc" },
        { title: "MapGeoJSON", slug: "mapgeojson" },
        { title: "MapClusterLayer", slug: "mapclusterlayer" },
      ]}
    >
      <DocsNote>
        <Text className="font-medium">Note:</Text> This library is built on top
        of{" "}
        <DocsLink
          href="https://maplibre.org/maplibre-react-native/"
          external
        >
          MapLibre React Native
        </DocsLink>
        . Most components wrap native MapLibre views and style layers. Refer to
        the{" "}
        <DocsLink
          href="https://maplibre.org/maplibre-react-native/docs/components/mapview/"
          external
        >
          MapLibre React Native docs
        </DocsLink>{" "}
        for additional native options not listed here.
      </DocsNote>

      <DocsSection title="Component Anatomy">
        <Text className="leading-7">
          All parts of the component that you can use and combine to build your
          map.
        </Text>
        <CodeBlock
          code={anatomyCode}
          showCopyButton={false}
        />
      </DocsSection>

      <DocsSection title="Map">
        <Text className="leading-7">
          The root container component that initializes MapLibre React Native
          and provides context to child components. Automatically handles theme
          switching between light and dark modes via the device color scheme.
        </Text>
        <Text className="leading-7">
          Accepts native{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-react-native/docs/components/mapview/"
            external
          >
            MapView
          </DocsLink>{" "}
          props from MapLibre React Native (excluding{" "}
          <DocsCode>children</DocsCode>, <DocsCode>mapStyle</DocsCode>, and a
          few internal load/region handlers). Style the outer wrapper with{" "}
          <DocsCode>className</DocsCode> (NativeWind) or the native{" "}
          <DocsCode>style</DocsCode> prop.
        </Text>
        <DocsPropTable props={mapProps} />
      </DocsSection>

      <DocsSection title="useMap">
        <Text className="leading-7">
          A hook that provides access to the native map instance, camera, and
          loading state. Must be used within a <DocsCode>Map</DocsCode>{" "}
          component.
        </Text>
        <CodeBlock
          code={mapHookExample}
          language="tsx"
          showCopyButton={false}
        />
        <Text className="leading-7">
          Returns <DocsCode>map</DocsCode> (native MapLibre map ref),{" "}
          <DocsCode>camera</DocsCode> (Camera ref for <DocsCode>flyTo</DocsCode>
          , <DocsCode>easeTo</DocsCode>, <DocsCode>zoomTo</DocsCode>, etc.),{" "}
          <DocsCode>isLoaded</DocsCode> (boolean), <DocsCode>viewport</DocsCode>{" "}
          (current center / zoom / bearing / pitch), and{" "}
          <DocsCode>resolvedTheme</DocsCode> (
          <DocsCode>&quot;light&quot; | &quot;dark&quot;</DocsCode>).
        </Text>
      </DocsSection>

      <DocsSection title="MapControls">
        <Text className="leading-7">
          Renders map control buttons (zoom, compass, locate, fullscreen). Must
          be used inside <DocsCode>Map</DocsCode>.
        </Text>
        <DocsPropTable props={mapControlsProps} />
      </DocsSection>

      <DocsSection title="MapMarker">
        <Text className="leading-7">
          A container for marker-related components. Provides context for its
          children and handles marker positioning on the native map.
        </Text>
        <Text className="leading-7">
          Built on the MapLibre React Native{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-react-native/docs/components/marker/"
            external
          >
            Marker
          </DocsLink>{" "}
          component (excluding <DocsCode>lngLat</DocsCode> and{" "}
          <DocsCode>onPress</DocsCode>, which are mapped to{" "}
          <DocsCode>longitude</DocsCode> / <DocsCode>latitude</DocsCode> and{" "}
          <DocsCode>onClick</DocsCode>).
        </Text>
        <DocsPropTable props={mapMarkerProps} />
      </DocsSection>

      <DocsSection title="MarkerContent">
        <Text className="leading-7">
          Renders the visual content of a marker. Must be used inside{" "}
          <DocsCode>MapMarker</DocsCode>. If no children provided, renders a
          default blue dot marker.
        </Text>
        <DocsPropTable props={markerContentProps} />
      </DocsSection>

      <DocsSection title="MarkerPopup">
        <Text className="leading-7">
          Renders a popup attached to the marker. Must be used inside{" "}
          <DocsCode>MapMarker</DocsCode> (typically as a child of{" "}
          <DocsCode>MarkerContent</DocsCode>). Styled as a React Native view -
          not MapLibre GL JS popups.
        </Text>
        <DocsPropTable props={markerPopupProps} />
      </DocsSection>

      <DocsSection title="MarkerTooltip">
        <Text className="leading-7">
          Renders a tooltip that appears on marker press (and pointer hover
          where available). Must be used inside <DocsCode>MapMarker</DocsCode>.
          Press-triggered tooltips auto-hide after a short delay; map press
          dismisses them.
        </Text>
        <DocsPropTable props={markerTooltipProps} />
      </DocsSection>

      <DocsSection title="MarkerLabel">
        <Text className="leading-7">
          Renders a text label above or below the marker. Must be used inside{" "}
          <DocsCode>MarkerContent</DocsCode>.
        </Text>
        <DocsPropTable props={markerLabelProps} />
      </DocsSection>

      <DocsSection title="MapPopup">
        <Text className="leading-7">
          A standalone popup component that can be placed anywhere on the map
          without a marker. Must be used inside <DocsCode>Map</DocsCode>.
          Implemented as a marker with an attached{" "}
          <DocsCode>MarkerPopup</DocsCode>.
        </Text>
        <DocsPropTable props={mapPopupProps} />
      </DocsSection>

      <DocsSection title="MapRoute">
        <Text className="leading-7">
          Renders a line/route on the map connecting coordinate points. Must be
          used inside <DocsCode>Map</DocsCode>. Supports press interactions for
          building route selection UIs.
        </Text>
        <DocsPropTable props={mapRouteProps} />
      </DocsSection>

      <DocsSection title="MapArc">
        <Text className="leading-7">
          Renders curved lines between coordinate pairs using a quadratic Bézier
          in longitude/latitude space. Must be used inside{" "}
          <DocsCode>Map</DocsCode>. Supports press interactions for building arc
          selection UIs.
        </Text>
        <Text className="leading-7">
          Built on a MapLibre{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/layers/#line"
            external
          >
            line layer
          </DocsLink>{" "}
          - the <DocsCode>paint</DocsCode> and <DocsCode>layout</DocsCode> props
          accept any field from <DocsCode>LineLayerSpecification</DocsCode>{" "}
          (e.g. <DocsCode>line-color</DocsCode>, <DocsCode>line-width</DocsCode>
          , <DocsCode>line-opacity</DocsCode>,{" "}
          <DocsCode>line-dasharray</DocsCode>, <DocsCode>line-blur</DocsCode>).
        </Text>
        <Text className="leading-7">
          Style per arc by passing a{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/expressions/"
            external
          >
            MapLibre expression
          </DocsLink>{" "}
          as any paint value. Reference fields on each datum with{" "}
          <DocsCode>{`["get", "fieldName"]`}</DocsCode>. Selection highlighting
          uses <DocsCode>selectedPaint</DocsCode> +{" "}
          <DocsCode>selectedId</DocsCode> from press interaction (there is no
          hover feature-state on native).
        </Text>
        <DocsPropTable props={mapArcProps} />
      </DocsSection>

      <DocsSection title="MapGeoJSON">
        <Text className="leading-7">
          Renders arbitrary GeoJSON as fill + outline layers. Must be used
          inside <DocsCode>Map</DocsCode> - typically with the{" "}
          <DocsCode>blank</DocsCode> prop for choropleths and region/data maps.
          Accepts a <DocsCode>FeatureCollection</DocsCode>,{" "}
          <DocsCode>Feature</DocsCode>, <DocsCode>Geometry</DocsCode>, or a URL
          string to fetch from. Supports a generic type parameter for typed
          feature properties: <DocsCode>{"MapGeoJSON<MyProperties>"}</DocsCode>.
        </Text>
        <Text className="leading-7">
          Fill and outline default to a theme-aware monochrome surface tone, so
          shapes read clearly on light/dark out of the box. Override either
          layer via <DocsCode>fillPaint</DocsCode> /{" "}
          <DocsCode>linePaint</DocsCode> (pass <DocsCode>false</DocsCode> to
          omit a layer), and pass{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/expressions/"
            external
          >
            MapLibre expressions
          </DocsLink>{" "}
          as paint values for data-driven styling. Selection highlighting via{" "}
          <DocsCode>selectedPaint</DocsCode> requires{" "}
          <DocsCode>promoteId</DocsCode> and <DocsCode>selectedId</DocsCode>.
        </Text>
        <DocsPropTable props={mapGeoJSONProps} />
      </DocsSection>

      <DocsSection title="MapClusterLayer">
        <Text className="leading-7">
          Renders clustered point data using MapLibre&apos;s native clustering.
          Automatically groups nearby points into clusters that expand on press.
          Must be used inside <DocsCode>Map</DocsCode>. Supports a generic type
          parameter for typed feature properties:{" "}
          <DocsCode>{"MapClusterLayer<MyProperties>"}</DocsCode>.
        </Text>
        <DocsPropTable props={mapClusterLayerProps} />
      </DocsSection>
    </DocsLayout>
  );
}
