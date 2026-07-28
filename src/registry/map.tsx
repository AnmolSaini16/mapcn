import {
  Camera,
  GeoJSONSource,
  Layer,
  LocationManager,
  Map as MapLibreMap,
  Marker,
  type CameraRef,
  type FillLayerSpecification,
  type GeoJSONSourceRef,
  type LineLayerSpecification,
  type MapRef as NativeMapRef,
  type PressEventWithFeatures,
  type StyleSpecification,
} from "@maplibre/maplibre-react-native";
import type * as GeoJSON from "geojson";
import { Locate, Maximize, Minus, Plus } from "lucide-react-native";
import type * as React from "react";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
  type NativeSyntheticEvent,
} from "react-native";

import { cn } from "@/lib/utils";

const styles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

const blankMapStyle: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "rgba(0, 0, 0, 0)" },
    },
  ],
};

type Theme = "light" | "dark";
type MapRef = NativeMapRef;
type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};
type MapStyleOption = string | StyleSpecification;

type MapContextValue = {
  camera: CameraRef | null;
  map: MapRef | null;
  isLoaded: boolean;
  resolvedTheme: Theme;
  viewport: MapViewport;
};

const MapContext = createContext<MapContextValue | null>(null);

/**
 * Access the map instance, camera, and current viewport from a descendant of
 * {@link Map}.
 */
function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

/**
 * Props for the cross-platform MapLibre map wrapper.
 */
type MapProps = Omit<
  React.ComponentProps<typeof MapLibreMap>,
  "children" | "mapStyle" | "onRegionIsChanging" | "onDidFinishLoadingMap"
> & {
  /** Map content: markers, sources, layers, and controls. */
  children?: ReactNode;
  /** Overrides the device colour scheme. */
  theme?: Theme;
  /** Map styles keyed by colour scheme. */
  styles?: Partial<Record<Theme, MapStyleOption>>;
  /** Renders an empty transparent map style for data visualizations. */
  blank?: boolean;
  /** Controls any supplied viewport values. */
  viewport?: Partial<MapViewport>;
  /** Called as the visible map viewport changes. */
  onViewportChange?: (viewport: MapViewport) => void;
  /** Displays an overlay while external map data is loading. */
  loading?: boolean;
};

/**
 * A React Native MapLibre map with light/dark styles, viewport state, and a
 * declarative camera.
 */
const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    theme,
    styles: customStyles,
    blank,
    viewport,
    onViewportChange,
    loading,
    style,
    ...props
  },
  ref,
) {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";
  const resolvedTheme = theme ?? systemTheme;
  const nativeMapRef = useRef<MapRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const [map, setMap] = useState<MapRef | null>(null);
  const [camera, setCamera] = useState<CameraRef | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isControlled = viewport !== undefined && onViewportChange !== undefined;
  const [currentViewport, setCurrentViewport] = useState<MapViewport>({
    center: [0, 0],
    zoom: 1,
    bearing: 0,
    pitch: 0,
  });

  useImperativeHandle(ref, () => {
    if (!nativeMapRef.current)
      throw new Error("Map ref is not available before mount");
    return nativeMapRef.current;
  });

  const mapStyle =
    customStyles?.[resolvedTheme] ??
    (blank ? blankMapStyle : styles[resolvedTheme]);
  const cameraState = {
    center: viewport?.center ?? currentViewport.center,
    zoom: viewport?.zoom ?? currentViewport.zoom,
    bearing: viewport?.bearing ?? currentViewport.bearing,
    pitch: viewport?.pitch ?? currentViewport.pitch,
  };

  useEffect(() => {
    if (!camera || !isControlled || !viewport) return;

    const nextViewport = {
      center: viewport.center ?? currentViewport.center,
      zoom: viewport.zoom ?? currentViewport.zoom,
      bearing: viewport.bearing ?? currentViewport.bearing,
      pitch: viewport.pitch ?? currentViewport.pitch,
    };
    const isCurrentViewport =
      nextViewport.center[0] === currentViewport.center[0] &&
      nextViewport.center[1] === currentViewport.center[1] &&
      nextViewport.zoom === currentViewport.zoom &&
      nextViewport.bearing === currentViewport.bearing &&
      nextViewport.pitch === currentViewport.pitch;

    if (!isCurrentViewport) {
      camera.jumpTo(nextViewport);
    }
  }, [camera, currentViewport, isControlled, viewport]);

  const contextValue = useMemo(
    () => ({ camera, map, isLoaded, resolvedTheme, viewport: currentViewport }),
    [camera, currentViewport, isLoaded, map, resolvedTheme],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <View className="relative flex-1">
        <MapLibreMap
          {...props}
          ref={(instance) => {
            nativeMapRef.current = instance;
            setMap(instance);
          }}
          mapStyle={mapStyle}
          onDidFinishLoadingMap={() => {
            setIsLoaded(true);
          }}
          onRegionIsChanging={(event) => {
            const nextViewport: MapViewport = {
              center: event.nativeEvent.center,
              zoom: event.nativeEvent.zoom,
              bearing: event.nativeEvent.bearing,
              pitch: event.nativeEvent.pitch,
            };
            setCurrentViewport(nextViewport);
            onViewportChange?.(nextViewport);
          }}
          style={[{ flex: 1 }, style]}
        >
          <Camera
            ref={(instance) => {
              cameraRef.current = instance;
              setCamera(instance);
            }}
            {...cameraState}
          />
          {children}
        </MapLibreMap>
        {loading ? <MapLoader /> : null}
      </View>
    </MapContext.Provider>
  );
});

/**
 * Loading overlay displayed by {@link Map}.
 */
function MapLoader() {
  return (
    <View className="bg-background/50 absolute inset-0 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}

/**
 * Props for a map marker rendered at a longitude/latitude coordinate.
 */
type MapMarkerProps = Omit<
  React.ComponentProps<typeof Marker>,
  "children" | "lngLat" | "onPress"
> & {
  /** Longitude in degrees. */
  longitude: number;
  /** Latitude in degrees. */
  latitude: number;
  /** Marker content. Include a single {@link MarkerContent} child. */
  children: ReactNode;
  /** Called when the marker is tapped. */
  onClick?: React.ComponentProps<typeof Marker>["onPress"];
};

/**
 * Renders an interactive native marker. Unlike web markers, native markers do
 * not expose pointer hover or drag events.
 */
function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  ...props
}: MapMarkerProps) {
  const content = getMarkerContent(children);

  if (!content) return null;

  return (
    <Marker
      {...props}
      lngLat={[longitude, latitude]}
      onPress={onClick}
    >
      {content}
    </Marker>
  );
}

/**
 * Finds the marker view that MapLibre Native can mount as the marker child.
 */
function getMarkerContent(children: ReactNode) {
  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === MarkerContent) {
      return child;
    }
  }

  return null;
}

/**
 * A view anchored to a {@link MapMarker}. It may contain labels, popups, and
 * arbitrary React Native content.
 */
type MarkerContentProps = React.ComponentProps<typeof View>;

function MarkerContent({ className, ...props }: MarkerContentProps) {
  return (
    <View
      {...props}
      className={cn("items-center justify-center", className)}
    />
  );
}

/**
 * Default circular marker content.
 */
function DefaultMarkerIcon() {
  return (
    <View className="size-4 rounded-full border-2 border-white bg-blue-500" />
  );
}

/**
 * Text positioned relative to marker content.
 */
type MarkerLabelProps = React.ComponentProps<typeof Text> & {
  /** Label text content */
  children: ReactNode;
  /** Additional CSS classes for the label */
  className?: string;
  /** Position of the label relative to the marker (default: "top") */
  position?: "top" | "bottom";
};

function MarkerLabel({
  children,
  className,
  position = "top",
}: MarkerLabelProps) {
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };

  return (
    <View
      className={cn(
        "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
        "text-foreground text-[10px] font-medium",
        positionClasses[position],
        className,
      )}
    >
      {children}
    </View>
  );
}

/**
 * Props shared by marker-attached popup and tooltip views.
 */
type MarkerPopupProps = React.ComponentProps<typeof View> & {
  /** Displays the view above or below its marker. */
  position?: "top" | "bottom";
};
type MarkerTooltipProps = MarkerPopupProps;

/**
 * A popup view positioned relative to its parent {@link MarkerContent}.
 *
 * MapLibre Native does not provide DOM-style popup portals. Place this inside
 * `MarkerContent` and control its visibility from application state.
 */
function MarkerPopup({
  className,
  position = "top",
  ...props
}: MarkerPopupProps) {
  return (
    <View
      {...props}
      className={cn(
        "bg-popover border-border absolute rounded-md border p-3",
        position === "top" ? "bottom-full mb-2" : "top-full mt-2",
        className,
      )}
    />
  );
}

/**
 * A compact, non-interactive annotation positioned beside marker content.
 */
function MarkerTooltip({
  className,
  position = "top",
  ...props
}: MarkerTooltipProps) {
  return (
    <View
      {...props}
      className={cn(
        "bg-popover border-border absolute rounded-md border px-2 py-1",
        position === "top" ? "bottom-full mb-2" : "top-full mt-2",
        className,
      )}
    />
  );
}

/**
 * Props for a popup pinned to a map coordinate.
 */
type MapPopupProps = MarkerPopupProps & {
  /** Longitude in degrees. */
  longitude: number;
  /** Latitude in degrees. */
  latitude: number;
};

/**
 * Renders a coordinate-pinned popup through a native marker.
 */
function MapPopup({ longitude, latitude, className, ...props }: MapPopupProps) {
  return (
    <MapMarker
      latitude={latitude}
      longitude={longitude}
    >
      <MarkerContent>
        <MarkerPopup
          className={className}
          {...props}
        />
      </MarkerContent>
    </MapMarker>
  );
}

/**
 * Props for the map control overlay.
 */
type MapControlsProps = {
  /** Overlay position. */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Additional NativeWind classes for the overlay. */
  className?: string;
  /** Shows zoom-in and zoom-out actions. */
  showZoom?: boolean;
  /** Shows a control that resets north and pitch. */
  showCompass?: boolean;
  /** Shows a native permission-aware current-location action. */
  showLocate?: boolean;
  /**
   * Shows an action for the enclosing screen to enter fullscreen mode.
   * Fullscreen belongs to the native screen rather than MapLibre itself.
   */
  showFullscreen?: boolean;
  /** Receives the current device coordinates after a successful location request. */
  onLocate?: (coordinates: { longitude: number; latitude: number }) => void;
  /** Lets the parent screen implement a native fullscreen presentation. */
  onFullscreenRequest?: () => void;
};

const controlPositionClasses = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
};

/**
 * Native controls for zoom, orientation, current location, and screen
 * fullscreen presentation.
 */
function MapControls({
  className,
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  onLocate,
  onFullscreenRequest,
}: MapControlsProps) {
  const { camera, viewport } = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const zoomIn = useCallback(
    () => camera?.zoomTo(viewport.zoom + 1, { duration: 200 }),
    [camera, viewport.zoom],
  );
  const zoomOut = useCallback(
    () => camera?.zoomTo(viewport.zoom - 1, { duration: 200 }),
    [camera, viewport.zoom],
  );
  const resetNorth = useCallback(
    () =>
      camera?.easeTo({
        center: viewport.center,
        zoom: viewport.zoom,
        bearing: 0,
        pitch: 0,
        duration: 200,
      }),
    [camera, viewport],
  );
  const locate = useCallback(() => {
    void (async () => {
      setIsLocating(true);

      try {
        const hasPermission = await LocationManager.requestPermissions();
        if (!hasPermission) return;

        const location = await LocationManager.getCurrentPosition();
        if (!location) return;

        const coordinates = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        };
        camera?.flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          duration: 1500,
          zoom: 14,
        });
        onLocate?.(coordinates);
      } catch {
        return;
      } finally {
        setIsLocating(false);
      }
    })();
  }, [camera, onLocate]);

  return (
    <View
      className={cn(
        "bg-background border-border absolute overflow-hidden rounded-md border",
        controlPositionClasses[position],
        className,
      )}
    >
      {showZoom ? (
        <ControlButton
          label="Zoom in"
          onPress={zoomIn}
        >
          <Plus size={16} />
        </ControlButton>
      ) : null}
      {showZoom ? (
        <ControlButton
          label="Zoom out"
          onPress={zoomOut}
        >
          <Minus size={16} />
        </ControlButton>
      ) : null}
      {showCompass ? (
        <ControlButton
          label="Reset bearing"
          onPress={resetNorth}
        >
          <Text
            className="text-foreground"
            style={{
              transform: [{ rotate: `${String(-viewport.bearing)}deg` }],
            }}
          >
            N
          </Text>
        </ControlButton>
      ) : null}
      {showLocate ? (
        <ControlButton
          disabled={isLocating}
          label="Find my location"
          onPress={locate}
        >
          {isLocating ? (
            <ActivityIndicator size="small" />
          ) : (
            <Locate size={16} />
          )}
        </ControlButton>
      ) : null}
      {showFullscreen && onFullscreenRequest ? (
        <ControlButton
          label="Toggle fullscreen"
          onPress={onFullscreenRequest}
        >
          <Maximize size={16} />
        </ControlButton>
      ) : null}
    </View>
  );
}

function ControlButton({
  children,
  disabled = false,
  label,
  onPress,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      className="border-border items-center border-b p-2.5 opacity-100 last:border-b-0 disabled:opacity-50"
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

/**
 * Props for a line route layer.
 */
type MapRouteProps = {
  /** Optional stable route identifier. */
  id?: string;
  /** Ordered [longitude, latitude] route coordinates. */
  coordinates: [number, number][];
  /** Route colour. */
  color?: string;
  /** Route width in points. */
  width?: number;
  /** Route opacity from 0 to 1. */
  opacity?: number;
  /** Dash and gap lengths. */
  dashArray?: [number, number];
  /** Additional MapLibre paint properties. */
  linePaint?: LineLayerSpecification["paint"];
  /** Additional MapLibre layout properties. */
  lineLayout?: LineLayerSpecification["layout"];
  /** Called when the route is tapped. */
  onClick?: () => void;
  /** Enables route tap handling. */
  interactive?: boolean;
  /** Places this route below the supplied layer id. */
  beforeId?: string;
};

/**
 * Declaratively renders a route and optional native tap interaction.
 */
function MapRoute({
  id: propId,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
  linePaint,
  lineLayout,
  onClick,
  interactive = true,
  beforeId,
}: MapRouteProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const data = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    }),
    [coordinates],
  );

  return (
    <GeoJSONSource
      data={data}
      id={`route-${id}`}
      onPress={interactive && onClick ? onClick : undefined}
    >
      <Layer
        beforeId={beforeId}
        id={`route-line-${id}`}
        layout={{
          "line-cap": "round",
          "line-join": "round",
          ...lineLayout,
        }}
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          ...(dashArray ? { "line-dasharray": dashArray } : {}),
          ...linePaint,
        }}
        type="line"
      />
    </GeoJSONSource>
  );
}

/**
 * A feature received from a native source tap.
 */
type MapGeoJSONFeature = GeoJSON.Feature;
/**
 * Payload for GeoJSON feature taps.
 */
type MapGeoJSONEvent = {
  /** The first rendered feature at the pressed location. */
  feature: MapGeoJSONFeature;
  /** Geographic location of the tap. */
  longitude: number;
  /** Geographic location of the tap. */
  latitude: number;
};
/**
 * Props for arbitrary GeoJSON fill and outline layers.
 */
type MapGeoJSONProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  /** GeoJSON data or an HTTP(S)/file URL supported by MapLibre Native. */
  data:
    | string
    | GeoJSON.FeatureCollection<GeoJSON.Geometry, P>
    | GeoJSON.Feature<GeoJSON.Geometry, P>
    | GeoJSON.Geometry;
  /** Optional stable source and layer identifier prefix. */
  id?: string;
  /** Fill paint, or false to omit the fill layer. */
  fillPaint?: FillLayerSpecification["paint"] | false;
  /** Outline paint, or false to omit the line layer. */
  linePaint?: LineLayerSpecification["paint"] | false;
  /** Called when a rendered feature is tapped. */
  onClick?: (event: MapGeoJSONEvent) => void;
  /** Enables native feature tap handling. */
  interactive?: boolean;
  /** Places GeoJSON layers below the supplied layer id. */
  beforeId?: string;
};

/**
 * Renders arbitrary GeoJSON as fill and outline layers. Native maps use taps
 * rather than browser pointer hover for feature interaction.
 */
function MapGeoJSON<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  id: propId,
  fillPaint = { "fill-color": "#3b82f6", "fill-opacity": 0.35 },
  linePaint = { "line-color": "#2563eb", "line-width": 1 },
  onClick,
  interactive = false,
  beforeId,
}: MapGeoJSONProps<P>) {
  const autoId = useId();
  const id = propId ?? autoId;
  const handlePress = useCallback(
    (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      const feature = event.nativeEvent.features[0];
      if (!feature || !onClick) return;
      onClick({
        feature,
        longitude: event.nativeEvent.lngLat[0],
        latitude: event.nativeEvent.lngLat[1],
      });
    },
    [onClick],
  );

  return (
    <GeoJSONSource
      data={data}
      id={`geojson-${id}`}
      onPress={interactive ? handlePress : undefined}
    >
      {fillPaint ? (
        <Layer
          beforeId={beforeId}
          id={`geojson-fill-${id}`}
          paint={fillPaint}
          type="fill"
        />
      ) : null}
      {linePaint ? (
        <Layer
          beforeId={beforeId}
          id={`geojson-line-${id}`}
          paint={linePaint}
          type="line"
        />
      ) : null}
    </GeoJSONSource>
  );
}

/**
 * A source/destination pair rendered by {@link MapArc}.
 */
type MapArcDatum = {
  /** Optional stable data identifier for native tap event lookup. */
  id?: string | number;
  /** Origin coordinate. */
  from: [number, number];
  /** Destination coordinate. */
  to: [number, number];
};
/**
 * Payload for an arc tap.
 */
type MapArcEvent<T extends MapArcDatum = MapArcDatum> = {
  /** Source data for the tapped arc. */
  arc: T;
  /** Geographic location of the tap. */
  longitude: number;
  /** Geographic location of the tap. */
  latitude: number;
};
/**
 * Props for a collection of curved line arcs.
 */
type MapArcProps<T extends MapArcDatum = MapArcDatum> = {
  /** Arc data. Each arc needs a unique id for tap events. */
  data: T[];
  /** Optional stable source and layer identifier prefix. */
  id?: string;
  /** Arc colour. */
  color?: string;
  /** Arc width. */
  width?: number;
  /** Arc opacity. */
  opacity?: number;
  /** Curve displacement from the straight line. */
  curvature?: number;
  /** Number of points used for each curve. */
  samples?: number;
  /** Additional line paint properties. */
  paint?: LineLayerSpecification["paint"];
  /** Additional line layout properties. */
  layout?: LineLayerSpecification["layout"];
  /** Called when an arc is tapped. */
  onClick?: (event: MapArcEvent<T>) => void;
  /** Enables native arc tap handling. */
  interactive?: boolean;
  /** Places this arc layer below the supplied layer id. */
  beforeId?: string;
};

/**
 * Renders curved source-to-destination lines with native tap interactions.
 */
function MapArc<T extends MapArcDatum = MapArcDatum>({
  data,
  id: propId,
  color = "#3b82f6",
  width = 2,
  opacity = 0.8,
  curvature = 0.2,
  samples = 64,
  paint,
  layout,
  onClick,
  interactive = true,
  beforeId,
}: MapArcProps<T>) {
  const autoId = useId();
  const id = propId ?? autoId;
  const geojson = useMemo<GeoJSON.FeatureCollection<GeoJSON.LineString>>(
    () => ({
      type: "FeatureCollection",
      features: data.map((arc, index) => {
        const { from, id: arcId, to } = arc;
        return {
          type: "Feature",
          properties: { id: arcId ?? index },
          geometry: {
            type: "LineString",
            coordinates: buildArcCoordinates(from, to, curvature, samples),
          },
        };
      }),
    }),
    [curvature, data, samples],
  );
  const handlePress = useCallback(
    (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      const feature = event.nativeEvent.features[0];
      const featureId: unknown = feature?.properties?.id;
      if (
        !onClick ||
        (typeof featureId !== "string" && typeof featureId !== "number")
      ) {
        return;
      }
      const arc = data.find((item, index) => (item.id ?? index) === featureId);
      if (!arc) return;
      onClick({
        arc,
        longitude: event.nativeEvent.lngLat[0],
        latitude: event.nativeEvent.lngLat[1],
      });
    },
    [data, onClick],
  );

  return (
    <GeoJSONSource
      data={geojson}
      id={`arc-${id}`}
      onPress={interactive ? handlePress : undefined}
    >
      <Layer
        beforeId={beforeId}
        id={`arc-line-${id}`}
        layout={{ "line-cap": "round", "line-join": "round", ...layout }}
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          ...paint,
        }}
        type="line"
      />
    </GeoJSONSource>
  );
}

/**
 * Builds a quadratic Bézier arc which takes the shorter route across the
 * antimeridian.
 */
function buildArcCoordinates(
  from: [number, number],
  to: [number, number],
  curvature: number,
  samples: number,
): [number, number][] {
  const [fromLongitude, fromLatitude] = from;
  const [destinationLongitude, toLatitude] = to;
  const longitudeDifference = destinationLongitude - fromLongitude;
  const toLongitude =
    longitudeDifference > 180
      ? destinationLongitude - 360
      : longitudeDifference < -180
        ? destinationLongitude + 360
        : destinationLongitude;
  const deltaLongitude = toLongitude - fromLongitude;
  const deltaLatitude = toLatitude - fromLatitude;
  const distance = Math.hypot(deltaLongitude, deltaLatitude);

  if (distance === 0 || curvature === 0) {
    return [from, [toLongitude, toLatitude]];
  }

  const midpointLongitude = (fromLongitude + toLongitude) / 2;
  const midpointLatitude = (fromLatitude + toLatitude) / 2;
  const controlLongitude =
    midpointLongitude - (deltaLatitude / distance) * distance * curvature;
  const controlLatitude =
    midpointLatitude + (deltaLongitude / distance) * distance * curvature;
  const count = Math.max(2, Math.floor(samples));

  return Array.from({ length: count + 1 }, (_, index) => {
    const progress = index / count;
    const inverse = 1 - progress;
    return [
      inverse ** 2 * fromLongitude +
        2 * inverse * progress * controlLongitude +
        progress ** 2 * toLongitude,
      inverse ** 2 * fromLatitude +
        2 * inverse * progress * controlLatitude +
        progress ** 2 * toLatitude,
    ];
  });
}

function isPointFeature(
  feature: GeoJSON.Feature,
): feature is GeoJSON.Feature<GeoJSON.Point> {
  return feature.geometry.type === "Point";
}

/**
 * Props for an automatically clustered point source.
 */
type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  /** Point data or a supported GeoJSON URL. */
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  /** Optional stable source and layer identifier prefix. */
  id?: string;
  /** Maximum zoom at which nearby points form clusters. */
  clusterRadius?: number;
  /** Cluster radius in pixels. */
  clusterMaxZoom?: number;
  /** Colours for small, medium, and large clusters. */
  clusterColors?: [string, string, string];
  /** Point counts at which cluster size and colour increase. */
  clusterThresholds?: [number, number];
  /** Colour for individual unclustered points. */
  pointColor?: string;
  /** Called when an individual point is tapped. */
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point>,
    coordinates: [number, number],
  ) => void;
  /** Called when a cluster is tapped instead of expanding it. */
  onClusterClick?: (
    clusterId: number,
    coordinates: [number, number],
    pointCount: number,
  ) => void;
};

const DEFAULT_CLUSTER_COLORS: [string, string, string] = [
  "#3b82f6",
  "#1d4ed8",
  "#1e3a8a",
];
const DEFAULT_CLUSTER_THRESHOLDS: [number, number] = [100, 750];

/**
 * Renders clusters, point counts, and individual points. Tapping a cluster
 * expands it by default; provide `onClusterClick` to take control.
 */
function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  id: propId,
  clusterRadius = 50,
  clusterMaxZoom = 14,
  clusterColors = DEFAULT_CLUSTER_COLORS,
  clusterThresholds = DEFAULT_CLUSTER_THRESHOLDS,
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>) {
  const { camera } = useMap();
  const autoId = useId();
  const id = propId ?? autoId;
  const sourceRef = useRef<GeoJSONSourceRef>(null);
  const handleClusterPress = useCallback(
    async (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      const feature = event.nativeEvent.features[0];
      if (!feature) return;

      const [longitude, latitude] = event.nativeEvent.lngLat;
      const clusterId: unknown = feature.properties?.cluster_id;
      const pointCount: unknown = feature.properties?.point_count;
      if (typeof clusterId === "number" && typeof pointCount === "number") {
        if (onClusterClick) {
          onClusterClick(clusterId, [longitude, latitude], pointCount);
          return;
        }

        const zoom =
          await sourceRef.current?.getClusterExpansionZoom(clusterId);
        if (zoom !== undefined) {
          camera?.easeTo({
            center: [longitude, latitude],
            duration: 300,
            zoom,
          });
        }
        return;
      }

      if (!isPointFeature(feature) || !onPointClick) return;
      onPointClick(feature, [longitude, latitude]);
    },
    [camera, onClusterClick, onPointClick],
  );
  const handlePress = useCallback(
    (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      void handleClusterPress(event);
    },
    [handleClusterPress],
  );

  return (
    <GeoJSONSource
      cluster
      clusterMaxZoom={clusterMaxZoom}
      clusterRadius={clusterRadius}
      data={data}
      id={`clusters-${id}`}
      onPress={handlePress}
      ref={sourceRef}
    >
      <Layer
        filter={["has", "point_count"]}
        id={`clusters-circle-${id}`}
        paint={{
          "circle-color": [
            "step",
            ["get", "point_count"],
            clusterColors[0],
            clusterThresholds[0],
            clusterColors[1],
            clusterThresholds[1],
            clusterColors[2],
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            clusterThresholds[0],
            24,
            clusterThresholds[1],
            30,
          ],
        }}
        type="circle"
      />
      <Layer
        filter={["has", "point_count"]}
        id={`clusters-count-${id}`}
        layout={{
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 12,
        }}
        paint={{ "text-color": "#ffffff" }}
        type="symbol"
      />
      <Layer
        filter={["!", ["has", "point_count"]]}
        id={`clusters-point-${id}`}
        paint={{ "circle-color": pointColor, "circle-radius": 6 }}
        type="circle"
      />
    </GeoJSONSource>
  );
}

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
