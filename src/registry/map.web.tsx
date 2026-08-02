import type * as GeoJSON from "geojson";
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

type MapStyleOption = string | Record<string, unknown>;

type MapRef = {
  getZoom: () => number;
  getBearing: () => number;
  getPitch: () => number;
};

type MapContextValue = {
  camera: null;
  map: MapRef | null;
  isLoaded: boolean;
  resolvedTheme: Theme;
  viewport: MapViewport;
  addMapPressListener: (listener: () => void) => () => void;
};

const DEFAULT_VIEWPORT: MapViewport = {
  center: [0, 0],
  zoom: 1,
  bearing: 0,
  pitch: 0,
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

type MapProps = {
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
  styles?: Partial<Record<Theme, MapStyleOption>>;
  blank?: boolean;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (viewport: MapViewport) => void;
  loading?: boolean;
};

const Map = forwardRef<MapRef, MapProps>(function Map(
  { children, className, style, viewport },
  _ref,
) {
  const resolvedViewport: MapViewport = {
    center: viewport?.center ?? DEFAULT_VIEWPORT.center,
    zoom: viewport?.zoom ?? DEFAULT_VIEWPORT.zoom,
    bearing: viewport?.bearing ?? DEFAULT_VIEWPORT.bearing,
    pitch: viewport?.pitch ?? DEFAULT_VIEWPORT.pitch,
  };

  return (
    <MapContext.Provider
      value={{
        camera: null,
        map: null,
        isLoaded: false,
        resolvedTheme: "light",
        viewport: resolvedViewport,
        addMapPressListener: () => () => undefined,
      }}
    >
      <View
        className={cn(
          "bg-muted flex-1 items-center justify-center gap-2 px-6",
          className,
        )}
        style={style}
      >
        <Text className="text-foreground text-center text-sm font-medium">
          Map preview
        </Text>
        <Text className="text-muted-foreground text-center text-xs">
          Map previews run on iOS and Android. Open this app in a simulator or
          device to see the live map.
        </Text>
        <View
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          pointerEvents="none"
        >
          {children}
        </View>
      </View>
    </MapContext.Provider>
  );
});

function NullComponent(_props: { children?: ReactNode }) {
  return null;
}

const DefaultMarkerIcon = NullComponent;
const MapArc = NullComponent;
const MapClusterLayer = NullComponent;
const MapControls = NullComponent;
const MapGeoJSON = NullComponent;
const MapMarker = NullComponent;
const MapPopup = NullComponent;
const MapRoute = NullComponent;
const MarkerContent = NullComponent;
const MarkerLabel = NullComponent;
const MarkerPopup = NullComponent;
const MarkerTooltip = NullComponent;

type MapMarkerProps = {
  children?: ReactNode;
  longitude: number;
  latitude: number;
  className?: string;
};

type MarkerContentProps = ComponentProps<typeof View> & {
  className?: string;
};

type MarkerLabelProps = {
  children?: ReactNode;
  className?: string;
};

type MarkerPopupProps = ComponentProps<typeof View> & {
  className?: string;
};

type MarkerTooltipProps = {
  children?: ReactNode;
  className?: string;
};

type MapPopupProps = MarkerPopupProps & {
  longitude?: number;
  latitude?: number;
};

type MapControlsProps = {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
};

type MapRouteProps = {
  coordinates?: [number, number][];
  className?: string;
};

type MapGeoJSONData<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> =
  | GeoJSON.Feature<GeoJSON.Geometry, P>
  | GeoJSON.FeatureCollection<GeoJSON.Geometry, P>
  | string;

type MapGeoJSONFeature<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = GeoJSON.Feature<GeoJSON.Geometry, P>;

type MapGeoJSONEvent<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  feature: MapGeoJSONFeature<P>;
  lngLat: { lng: number; lat: number };
};

type MapGeoJSONProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: MapGeoJSONData<P>;
  className?: string;
};

type MapArcDatum = {
  source: [number, number];
  target: [number, number];
  id?: string | number;
};

type MapArcEvent<T extends MapArcDatum = MapArcDatum> = {
  datum: T;
  lngLat: { lng: number; lat: number };
};

type MapArcProps<T extends MapArcDatum = MapArcDatum> = {
  data: T[];
  className?: string;
};

type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: MapGeoJSONData<P>;
  className?: string;
};

export {
  DefaultMarkerIcon,
  Map,
  MapArc,
  MapClusterLayer,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  useMap,
};
export type {
  MapArcDatum,
  MapArcEvent,
  MapArcProps,
  MapClusterLayerProps,
  MapControlsProps,
  MapGeoJSONData,
  MapGeoJSONEvent,
  MapGeoJSONFeature,
  MapGeoJSONProps,
  MapMarkerProps,
  MapPopupProps,
  MapProps,
  MapRef,
  MapRouteProps,
  MapStyleOption,
  MapViewport,
  MarkerContentProps,
  MarkerLabelProps,
  MarkerPopupProps,
  MarkerTooltipProps,
};
