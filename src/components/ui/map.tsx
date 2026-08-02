/* eslint-disable max-lines */
import {
  Camera,
  GeoJSONSource,
  Layer,
  LocationManager,
  Map as MapLibreMap,
  Marker,
  ViewAnnotation,
  type CameraRef,
  type FillLayerSpecification,
  type GeoJSONSourceRef,
  type LineLayerSpecification,
  type MapRef as NativeMapRef,
  type PressEventWithFeatures,
  type StyleSpecification,
} from "@maplibre/maplibre-react-native";
import type * as GeoJSON from "geojson";
import { Locate, Maximize, Minus, Plus, X } from "lucide-react-native";
import type * as React from "react";
import {
  Children,
  cloneElement,
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
  Animated,
  Pressable,
  Text,
  useColorScheme,
  View,
  type NativeSyntheticEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const defaultStyles = {
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

function useStableValue<T>(value: T): T {
  const key = useMemo(() => JSON.stringify(value) ?? "", [value]);

  return useMemo(() => value, [key]);
}

function mergeSelectedPaint<T extends Record<string, unknown>>(
  paint: T,
  selectedPaint: T | undefined,
  promoteId: string,
  selectedId: string | number | null | undefined,
): T {
  if (!selectedPaint || selectedId === null || selectedId === undefined) {
    return paint;
  }

  const merged: Record<string, unknown> = { ...paint };
  for (const [key, selectedValue] of Object.entries(selectedPaint)) {
    if (selectedValue === undefined) continue;
    const baseValue = merged[key];
    merged[key] =
      baseValue === undefined
        ? selectedValue
        : [
            "case",
            ["==", ["to-string", ["get", promoteId]], String(selectedId)],
            selectedValue,
            baseValue,
          ];
  }
  return merged as T;
}

type Theme = "light" | "dark";
type MapRef = NativeMapRef;
type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};
type MapStyleOption = string | StyleSpecification;

type MapPressListener = () => void;

type MapContextValue = {
  camera: CameraRef | null;
  map: MapRef | null;
  isLoaded: boolean;
  resolvedTheme: Theme;
  viewport: MapViewport;
  addMapPressListener: (listener: MapPressListener) => () => void;
};

const MapContext = createContext<MapContextValue | null>(null);

type MarkerTooltipController = {
  show: (reason: "press" | "hover") => void;
  hide: () => void;
  toggle: () => void;
};

type MarkerInteractionContextValue = {
  suppressNextPress: () => void;
  setTopOverlayHeight: (height: number) => void;
  registerTooltip: (controller: MarkerTooltipController) => () => void;
  showTooltipFromHover: () => void;
  hideTooltipFromHover: () => void;
};

const MarkerInteractionContext =
  createContext<MarkerInteractionContextValue | null>(null);

const TOOLTIP_AUTO_HIDE_MS = 2500;

function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

type MapProps = Omit<
  React.ComponentProps<typeof MapLibreMap>,
  | "children"
  | "mapStyle"
  | "onRegionIsChanging"
  | "onDidFinishLoadingMap"
  | "onDidFinishLoadingStyle"
  | "className"
> & {
  children?: ReactNode;
  className?: string;
  theme?: Theme;
  styles?: Partial<Record<Theme, MapStyleOption>>;
  blank?: boolean;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (viewport: MapViewport) => void;
  loading?: boolean;
};

function MapLoader() {
  return (
    <View className="bg-background/50 absolute inset-0 z-10 items-center justify-center">
      <View className="flex-row gap-1">
        <View className="bg-muted-foreground/60 size-1.5 rounded-full opacity-60" />
        <View className="bg-muted-foreground/60 size-1.5 rounded-full opacity-80" />
        <View className="bg-muted-foreground/60 size-1.5 rounded-full" />
      </View>
      <ActivityIndicator className="absolute" />
    </View>
  );
}

const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme,
    styles: customStyles,
    blank = false,
    viewport,
    onViewportChange,
    loading = false,
    style,
    onPress,
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
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const internalUpdateRef = useRef(false);
  const onViewportChangeRef = useRef(onViewportChange);
  const mapPressListenersRef = useRef(new Set<MapPressListener>());

  useEffect(() => {
    onViewportChangeRef.current = onViewportChange;
  }, [onViewportChange]);

  const addMapPressListener = useCallback((listener: MapPressListener) => {
    mapPressListenersRef.current.add(listener);
    return () => {
      mapPressListenersRef.current.delete(listener);
    };
  }, []);

  const handleMapPress = useCallback<
    NonNullable<React.ComponentProps<typeof MapLibreMap>["onPress"]>
  >(
    (event) => {
      for (const listener of mapPressListenersRef.current) {
        listener();
      }
      onPress?.(event);
    },
    [onPress],
  );

  const isControlled = viewport !== undefined && onViewportChange !== undefined;
  const [currentViewport, setCurrentViewport] = useState<MapViewport>({
    center: viewport?.center ?? [0, 0],
    zoom: viewport?.zoom ?? 1,
    bearing: viewport?.bearing ?? 0,
    pitch: viewport?.pitch ?? 0,
  });

  const stableStyles = useStableValue(customStyles);
  const mapStyles = useMemo(() => {
    if (stableStyles) {
      return {
        dark: stableStyles.dark ?? defaultStyles.dark,
        light: stableStyles.light ?? defaultStyles.light,
      };
    }
    if (blank) {
      return { dark: blankMapStyle, light: blankMapStyle };
    }
    return defaultStyles;
  }, [stableStyles, blank]);

  const mapStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

  useImperativeHandle(ref, () => {
    if (!nativeMapRef.current) {
      throw new Error("Map ref is not available before mount");
    }
    return nativeMapRef.current;
  }, [map]);

  const [initialViewState] = useState(() => ({
    center: viewport?.center ?? ([0, 0] as [number, number]),
    zoom: viewport?.zoom ?? 1,
    bearing: viewport?.bearing ?? 0,
    pitch: viewport?.pitch ?? 0,
  }));

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

    if (isCurrentViewport) return;

    internalUpdateRef.current = true;
    camera.jumpTo(nextViewport);
    setCurrentViewport(nextViewport);
    const timeout = setTimeout(() => {
      internalUpdateRef.current = false;
    }, 50);
    return () => {
      clearTimeout(timeout);
    };
  }, [camera, currentViewport, isControlled, viewport]);

  useEffect(() => {
    setIsStyleLoaded(false);
  }, [mapStyle]);

  const contextValue = useMemo(
    () => ({
      camera,
      map,
      isLoaded: isLoaded && isStyleLoaded,
      resolvedTheme,
      viewport: currentViewport,
      addMapPressListener,
    }),
    [
      addMapPressListener,
      camera,
      currentViewport,
      isLoaded,
      isStyleLoaded,
      map,
      resolvedTheme,
    ],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <View className={cn("relative flex-1", className)}>
        <MapLibreMap
          androidView="texture"
          {...props}
          ref={(instance) => {
            nativeMapRef.current = instance;
            setMap(instance);
          }}
          mapStyle={mapStyle}
          onDidFinishLoadingMap={() => {
            setIsLoaded(true);
          }}
          onDidFinishLoadingStyle={() => {
            setIsStyleLoaded(true);
          }}
          onPress={handleMapPress}
          onRegionIsChanging={(event) => {
            if (internalUpdateRef.current) return;
            const nextViewport: MapViewport = {
              center: event.nativeEvent.center,
              zoom: event.nativeEvent.zoom,
              bearing: event.nativeEvent.bearing,
              pitch: event.nativeEvent.pitch,
            };
            setCurrentViewport(nextViewport);
            onViewportChangeRef.current?.(nextViewport);
          }}
          style={[{ flex: 1 }, style]}
        >
          <Camera
            ref={(instance) => {
              cameraRef.current = instance;
              setCamera(instance);
            }}
            {...(isControlled ? cameraState : { initialViewState })}
          />
          {isStyleLoaded ? children : null}
        </MapLibreMap>
        {!isLoaded || !isStyleLoaded || loading ? <MapLoader /> : null}
      </View>
    </MapContext.Provider>
  );
});

type MarkerDragLngLat = {
  lng: number;
  lat: number;
};

type MarkerDragEvent = NativeSyntheticEvent<{
  lngLat: [number, number];
}>;

type MapMarkerProps = Omit<
  React.ComponentProps<typeof Marker>,
  "children" | "lngLat" | "onPress"
> & {
  longitude: number;
  latitude: number;
  children?: ReactNode;
  onClick?: React.ComponentProps<typeof Marker>["onPress"];
  draggable?: boolean;
  onDragStart?: (lngLat: MarkerDragLngLat) => void;
  onDrag?: (lngLat: MarkerDragLngLat) => void;
  onDragEnd?: (lngLat: MarkerDragLngLat) => void;
};

function getMarkerContent(children: ReactNode) {
  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === MarkerContent) {
      return child;
    }
  }

  return null;
}

function getMarkerTooltips(children: ReactNode) {
  return Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === MarkerTooltip,
  );
}

function composeMarkerChildren(children: ReactNode) {
  const content = getMarkerContent(children);
  const tooltips = getMarkerTooltips(children);

  if (content) {
    if (tooltips.length === 0) {
      return content;
    }

    return cloneElement(content, {}, [
      ...Children.toArray((content.props as MarkerContentProps).children),
      ...tooltips,
    ]);
  }

  if (Children.count(children) > 0) {
    return <MarkerContent>{children}</MarkerContent>;
  }

  return (
    <MarkerContent>
      <DefaultMarkerIcon />
    </MarkerContent>
  );
}

function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  offset,
  ref: _ref,
  ...props
}: MapMarkerProps) {
  const suppressPressRef = useRef(false);
  const tooltipControllerRef = useRef<MarkerTooltipController | null>(null);
  const [topOverlayHeight, setTopOverlayHeight] = useState(0);
  const markerChildren = composeMarkerChildren(children);

  const handlePress = useCallback<
    NonNullable<React.ComponentProps<typeof Marker>["onPress"]>
  >(
    (event) => {
      if (suppressPressRef.current) {
        suppressPressRef.current = false;
        return;
      }

      if (onClick) {
        onClick(event);
        return;
      }

      tooltipControllerRef.current?.toggle();
    },
    [onClick],
  );

  const toLngLat = useCallback((event: MarkerDragEvent): MarkerDragLngLat => {
    const [lng, lat] = event.nativeEvent.lngLat;
    return { lng, lat };
  }, []);

  const handleDragStart = useCallback(
    (event: MarkerDragEvent) => {
      onDragStart?.(toLngLat(event));
    },
    [onDragStart, toLngLat],
  );

  const handleDrag = useCallback(
    (event: MarkerDragEvent) => {
      onDrag?.(toLngLat(event));
    },
    [onDrag, toLngLat],
  );

  const handleDragEnd = useCallback(
    (event: MarkerDragEvent) => {
      onDragEnd?.(toLngLat(event));
    },
    [onDragEnd, toLngLat],
  );

  const markerInteractionValue = useMemo<MarkerInteractionContextValue>(
    () => ({
      suppressNextPress: () => {
        suppressPressRef.current = true;
      },
      setTopOverlayHeight,
      registerTooltip: (controller) => {
        tooltipControllerRef.current = controller;
        return () => {
          if (tooltipControllerRef.current === controller) {
            tooltipControllerRef.current = null;
          }
        };
      },
      showTooltipFromHover: () => {
        tooltipControllerRef.current?.show("hover");
      },
      hideTooltipFromHover: () => {
        tooltipControllerRef.current?.hide();
      },
    }),
    [],
  );

  const resolvedOffset = useMemo((): [number, number] => {
    const baseX = offset?.[0] ?? 0;
    const baseY = offset?.[1] ?? 0;
    return [baseX, baseY - topOverlayHeight / 2];
  }, [offset, topOverlayHeight]);

  return (
    <MarkerInteractionContext.Provider value={markerInteractionValue}>
      {draggable ? (
        <ViewAnnotation
          {...props}
          draggable
          lngLat={[longitude, latitude]}
          offset={resolvedOffset}
          onPress={handlePress}
          onDragStart={onDragStart ? handleDragStart : undefined}
          onDrag={onDrag ? handleDrag : undefined}
          onDragEnd={onDragEnd ? handleDragEnd : undefined}
        >
          {markerChildren}
        </ViewAnnotation>
      ) : (
        <Marker
          {...props}
          lngLat={[longitude, latitude]}
          offset={resolvedOffset}
          onPress={handlePress}
        >
          {markerChildren}
        </Marker>
      )}
    </MarkerInteractionContext.Provider>
  );
}

type MarkerContentProps = React.ComponentProps<typeof View> & {
  children?: ReactNode;
};

function MarkerContent({ className, children, ...props }: MarkerContentProps) {
  const markerInteraction = useContext(MarkerInteractionContext);
  const childArray = Children.toArray(children);
  const topPopups: ReactNode[] = [];
  const bottomPopups: ReactNode[] = [];
  const rest: ReactNode[] = [];

  for (const child of childArray) {
    if (isValidElement(child) && child.type === MarkerPopup) {
      const position =
        (child.props as { position?: "top" | "bottom" }).position ?? "top";
      if (position === "bottom") {
        bottomPopups.push(child);
      } else {
        topPopups.push(child);
      }
    } else {
      rest.push(child);
    }
  }

  const core =
    rest.length > 0 ? (
      rest
    ) : topPopups.length === 0 && bottomPopups.length === 0 ? (
      <DefaultMarkerIcon />
    ) : null;

  return (
    <View
      {...props}
      collapsable={false}
      className={cn("relative items-center justify-center", className)}
      onPointerEnter={() => {
        markerInteraction?.showTooltipFromHover();
      }}
      onPointerLeave={() => {
        markerInteraction?.hideTooltipFromHover();
      }}
    >
      {topPopups.length > 0 ? (
        <View
          className="items-center"
          onLayout={(event) => {
            if (!core) {
              markerInteraction?.setTopOverlayHeight(0);
              return;
            }
            markerInteraction?.setTopOverlayHeight(
              event.nativeEvent.layout.height,
            );
          }}
        >
          {topPopups}
        </View>
      ) : null}
      {core}
      {bottomPopups}
    </View>
  );
}

function DefaultMarkerIcon() {
  return (
    <View className="size-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
  );
}

type MarkerLabelProps = {
  children: ReactNode;
  className?: string;
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
      className={cn("absolute items-center", positionClasses[position])}
      pointerEvents="none"
      style={{ left: -96, right: -96 }}
    >
      <View className={cn("self-center", className)}>
        {typeof children === "string" || typeof children === "number" ? (
          <Text
            className="text-foreground text-[10px] font-medium"
            // numberOfLines={1}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

function PopupCloseButton({ onPress }: { onPress: () => void }) {
  const markerInteraction = useContext(MarkerInteractionContext);

  return (
    <Pressable
      accessibilityLabel="Close popup"
      className="absolute top-1 right-1 z-10 size-5 items-center justify-center rounded-sm"
      hitSlop={8}
      onPressIn={() => {
        markerInteraction?.suppressNextPress();
      }}
      onPress={() => {
        markerInteraction?.suppressNextPress();
        onPress();
      }}
    >
      <X
        className="text-foreground"
        size={14}
      />
    </Pressable>
  );
}

type MarkerPopupProps = React.ComponentProps<typeof View> & {
  position?: "top" | "bottom";
  closeButton?: boolean;
  closeOnClick?: boolean;
  onClose?: () => void;
};

type MarkerTooltipProps = {
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom";
};

function MarkerPopup({
  className,
  position = "top",
  closeButton = false,
  closeOnClick = true,
  onClose,
  children,
  ...props
}: MarkerPopupProps) {
  const markerInteraction = useContext(MarkerInteractionContext);
  const { addMapPressListener } = useMap();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!closeOnClick) return;

    let enabled = false;
    const enableTimeout = setTimeout(() => {
      enabled = true;
    }, 50);

    const unsubscribe = addMapPressListener(() => {
      if (!enabled) return;
      onCloseRef.current?.();
    });

    return () => {
      clearTimeout(enableTimeout);
      unsubscribe();
    };
  }, [addMapPressListener, closeOnClick]);

  useEffect(() => {
    return () => {
      markerInteraction?.setTopOverlayHeight(0);
    };
  }, [markerInteraction]);

  return (
    <View
      {...props}
      className={cn(
        "bg-popover border-border relative max-w-62 rounded-md border p-3 shadow-md",
        position === "top" ? "mb-2" : "mt-2",
        className,
      )}
      onTouchStart={() => {
        markerInteraction?.suppressNextPress();
      }}
    >
      {closeButton ? (
        <PopupCloseButton
          onPress={() => {
            onClose?.();
          }}
        />
      ) : null}
      {children}
    </View>
  );
}

function MarkerTooltip({
  className,
  position = "top",
  children,
}: MarkerTooltipProps) {
  const markerInteraction = useContext(MarkerInteractionContext);
  const { addMapPressListener } = useMap();
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const reasonRef = useRef<"press" | "hover" | null>(null);
  const opacity = useMemo(() => new Animated.Value(0), []);
  const scale = useMemo(() => new Animated.Value(0.95), []);

  const show = useCallback((reason: "press" | "hover") => {
    reasonRef.current = reason;
    visibleRef.current = true;
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    reasonRef.current = null;
    visibleRef.current = false;
    setVisible(false);
  }, []);

  const toggle = useCallback(() => {
    if (visibleRef.current) {
      hide();
      return;
    }
    show("press");
  }, [hide, show]);

  useEffect(() => {
    return markerInteraction?.registerTooltip({ show, hide, toggle });
  }, [hide, markerInteraction, show, toggle]);

  useEffect(() => {
    if (!visible) return;

    let enabled = false;
    const enableTimeout = setTimeout(() => {
      enabled = true;
    }, 50);

    const unsubscribe = addMapPressListener(() => {
      if (!enabled) return;
      hide();
    });

    return () => {
      clearTimeout(enableTimeout);
      unsubscribe();
    };
  }, [addMapPressListener, hide, visible]);

  useEffect(() => {
    if (!visible || reasonRef.current !== "press") return;
    const timeout = setTimeout(hide, TOOLTIP_AUTO_HIDE_MS);
    return () => {
      clearTimeout(timeout);
    };
  }, [hide, visible]);

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    scale.setValue(0.95);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, visible]);

  if (!visible) return null;

  return (
    <Animated.View
      className={cn(
        "absolute items-center",
        position === "top" ? "bottom-full mb-2" : "top-full mt-2",
      )}
      pointerEvents="none"
      style={{
        left: -96,
        right: -96,
        opacity,
        transform: [{ scale }],
      }}
    >
      <View
        className={cn(
          "bg-foreground rounded-md px-2 py-1 shadow-md",
          className,
        )}
      >
        <TextClassContext.Provider value="text-background text-xs">
          {children}
        </TextClassContext.Provider>
      </View>
    </Animated.View>
  );
}

type MapPopupProps = MarkerPopupProps & {
  longitude: number;
  latitude: number;
};

function MapPopup({
  longitude,
  latitude,
  className,
  onClose,
  closeButton = false,
  closeOnClick = true,
  ...props
}: MapPopupProps) {
  return (
    <MapMarker
      latitude={latitude}
      longitude={longitude}
    >
      <MarkerContent>
        <MarkerPopup
          className={className}
          closeButton={closeButton}
          closeOnClick={closeOnClick}
          onClose={onClose}
          {...props}
        />
      </MarkerContent>
    </MapMarker>
  );
}

type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  onLocate?: (coordinates: { longitude: number; latitude: number }) => void;
  onFullscreenRequest?: () => void;
};

const controlPositionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

function ControlGroup({ children }: { children: ReactNode }) {
  return (
    <View className="border-border bg-background overflow-hidden rounded-md border shadow-sm">
      {children}
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
      className="border-border size-8 items-center justify-center border-b opacity-100 last:border-b-0 disabled:opacity-50"
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

function CompassButton({ onPress }: { onPress: () => void }) {
  const { viewport } = useMap();

  return (
    <ControlButton
      label="Reset bearing to north"
      onPress={onPress}
    >
      <Svg
        height={20}
        style={{
          transform: [
            { perspective: 200 },
            { rotateX: `${String(viewport.pitch)}deg` },
            { rotateZ: `${String(-viewport.bearing)}deg` },
          ],
        }}
        viewBox="0 0 24 24"
        width={20}
      >
        <Path
          d="M12 2L16 12H12V2Z"
          fill="#ef4444"
        />
        <Path
          d="M12 2L8 12H12V2Z"
          fill="#fca5a5"
        />
        <Path
          d="M12 22L16 12H12V22Z"
          fill="rgba(115,115,115,0.6)"
        />
        <Path
          d="M12 22L8 12H12V22Z"
          fill="rgba(115,115,115,0.3)"
        />
      </Svg>
    </ControlButton>
  );
}

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

  const zoomIn = useCallback(() => {
    camera?.zoomTo(viewport.zoom + 1, { duration: 300 });
  }, [camera, viewport.zoom]);

  const zoomOut = useCallback(() => {
    camera?.zoomTo(viewport.zoom - 1, { duration: 300 });
  }, [camera, viewport.zoom]);

  const resetNorth = useCallback(() => {
    camera?.easeTo({
      center: viewport.center,
      zoom: viewport.zoom,
      bearing: 0,
      pitch: 0,
      duration: 300,
    });
  }, [camera, viewport]);

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
        "absolute z-10 flex-col gap-1.5",
        controlPositionClasses[position],
        className,
      )}
      pointerEvents="box-none"
    >
      {showZoom ? (
        <ControlGroup>
          <ControlButton
            label="Zoom in"
            onPress={zoomIn}
          >
            <Plus size={16} />
          </ControlButton>
          <ControlButton
            label="Zoom out"
            onPress={zoomOut}
          >
            <Minus size={16} />
          </ControlButton>
        </ControlGroup>
      ) : null}
      {showCompass ? (
        <ControlGroup>
          <CompassButton onPress={resetNorth} />
        </ControlGroup>
      ) : null}
      {showLocate ? (
        <ControlGroup>
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
        </ControlGroup>
      ) : null}
      {showFullscreen && onFullscreenRequest ? (
        <ControlGroup>
          <ControlButton
            label="Toggle fullscreen"
            onPress={onFullscreenRequest}
          >
            <Maximize size={16} />
          </ControlButton>
        </ControlGroup>
      ) : null}
    </View>
  );
}

type MapRouteProps = {
  id?: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: [number, number];
  linePaint?: LineLayerSpecification["paint"];
  lineLayout?: LineLayerSpecification["layout"];
  onClick?: () => void;
  interactive?: boolean;
  beforeId?: string;
};

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

type MapGeoJSONData<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> =
  | string
  | GeoJSON.FeatureCollection<GeoJSON.Geometry, P>
  | GeoJSON.Feature<GeoJSON.Geometry, P>
  | GeoJSON.Geometry;

type MapFillPaint = NonNullable<FillLayerSpecification["paint"]>;
type MapLinePaint = NonNullable<LineLayerSpecification["paint"]>;

type MapGeoJSONFeature<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = GeoJSON.Feature<GeoJSON.Geometry, P>;

type MapGeoJSONEvent<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  feature: MapGeoJSONFeature<P>;
  longitude: number;
  latitude: number;
};

type MapGeoJSONProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: MapGeoJSONData<P>;
  id?: string;
  /**
   * Feature property used to match `selectedId` for press-driven selection
   * styling. Native replacement for web hover feature-state.
   */
  promoteId?: string;
  fillPaint?: MapFillPaint | false;
  linePaint?: MapLinePaint | false;
  /**
   * Paint merged onto the selected feature. Requires `promoteId` and
   * `selectedId`. Use with press selection instead of web hover paint.
   */
  selectedPaint?: MapFillPaint;
  /** Currently selected feature id from press interaction. */
  selectedId?: string | number | null;
  onClick?: (event: MapGeoJSONEvent<P>) => void;
  interactive?: boolean;
  beforeId?: string;
};

const GEOJSON_DEFAULT_COLORS = {
  light: { fill: "#d4d4d4", line: "#ffffff" },
  dark: { fill: "#404040", line: "#171717" },
} satisfies Record<Theme, { fill: string; line: string }>;

function MapGeoJSON<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  id: propId,
  promoteId = "id",
  fillPaint,
  linePaint,
  selectedPaint,
  selectedId = null,
  onClick,
  interactive = false,
  beforeId,
}: MapGeoJSONProps<P>) {
  const { resolvedTheme } = useMap();
  const autoId = useId();
  const id = propId ?? autoId;
  const defaults = GEOJSON_DEFAULT_COLORS[resolvedTheme];
  const showFill = fillPaint !== false;
  const showLine = linePaint !== false;

  const mergedFillPaint = useMemo(
    () =>
      mergeSelectedPaint(
        {
          "fill-color": defaults.fill,
          ...(fillPaint === false ? {} : (fillPaint ?? {})),
        },
        selectedPaint,
        promoteId,
        selectedId,
      ),
    [defaults.fill, fillPaint, promoteId, selectedId, selectedPaint],
  );
  const mergedLinePaint = useMemo(
    () => ({
      "line-color": defaults.line,
      "line-width": 0.5,
      ...(linePaint === false ? {} : (linePaint ?? {})),
    }),
    [defaults.line, linePaint],
  );

  const handlePress = useCallback(
    (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
      const feature = event.nativeEvent.features[0];
      if (!feature || !onClick) return;
      onClick({
        feature: feature as MapGeoJSONFeature<P>,
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
      {showFill ? (
        <Layer
          beforeId={beforeId}
          id={`geojson-fill-${id}`}
          paint={mergedFillPaint}
          type="fill"
        />
      ) : null}
      {showLine ? (
        <Layer
          beforeId={beforeId}
          id={`geojson-line-${id}`}
          paint={mergedLinePaint}
          type="line"
        />
      ) : null}
    </GeoJSONSource>
  );
}

type MapArcDatum = {
  id: string | number;
  from: [number, number];
  to: [number, number];
};

type MapArcEvent<T extends MapArcDatum = MapArcDatum> = {
  arc: T;
  longitude: number;
  latitude: number;
};

type MapArcLinePaint = NonNullable<LineLayerSpecification["paint"]>;
type MapArcLineLayout = NonNullable<LineLayerSpecification["layout"]>;

type MapArcProps<T extends MapArcDatum = MapArcDatum> = {
  data: T[];
  id?: string;
  color?: string;
  width?: number;
  opacity?: number;
  curvature?: number;
  samples?: number;
  paint?: MapArcLinePaint;
  layout?: MapArcLineLayout;
  /**
   * Paint for the selected arc. Pair with `selectedId` from press selection
   * instead of web hover paint.
   */
  selectedPaint?: MapArcLinePaint;
  selectedId?: string | number | null;
  onClick?: (event: MapArcEvent<T>) => void;
  interactive?: boolean;
  beforeId?: string;
};

const DEFAULT_ARC_CURVATURE = 0.2;
const DEFAULT_ARC_SAMPLES = 64;
const ARC_HIT_MIN_WIDTH = 12;
const ARC_HIT_PADDING = 6;

const DEFAULT_ARC_PAINT: MapArcLinePaint = {
  "line-color": "#4285F4",
  "line-width": 2,
  "line-opacity": 0.85,
};

const DEFAULT_ARC_LAYOUT: MapArcLineLayout = {
  "line-join": "round",
  "line-cap": "round",
};

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

function MapArc<T extends MapArcDatum = MapArcDatum>({
  data,
  id: propId,
  color,
  width,
  opacity,
  curvature = DEFAULT_ARC_CURVATURE,
  samples = DEFAULT_ARC_SAMPLES,
  paint,
  layout,
  selectedPaint,
  selectedId = null,
  onClick,
  interactive = true,
  beforeId,
}: MapArcProps<T>) {
  const autoId = useId();
  const id = propId ?? autoId;

  const shortcutPaint = useMemo(
    () => ({
      ...(color !== undefined ? { "line-color": color } : {}),
      ...(width !== undefined ? { "line-width": width } : {}),
      ...(opacity !== undefined ? { "line-opacity": opacity } : {}),
    }),
    [color, opacity, width],
  );

  const mergedPaint = useMemo(
    () =>
      mergeSelectedPaint(
        { ...DEFAULT_ARC_PAINT, ...shortcutPaint, ...paint },
        selectedPaint,
        "id",
        selectedId,
      ),
    [paint, selectedId, selectedPaint, shortcutPaint],
  );
  const mergedLayout = useMemo(
    () => ({ ...DEFAULT_ARC_LAYOUT, ...layout }),
    [layout],
  );

  const hitWidth = useMemo(() => {
    const lineWidth =
      paint?.["line-width"] ?? width ?? DEFAULT_ARC_PAINT["line-width"];
    const base = typeof lineWidth === "number" ? lineWidth : ARC_HIT_MIN_WIDTH;
    return Math.max(base + ARC_HIT_PADDING, ARC_HIT_MIN_WIDTH);
  }, [paint, width]);

  const geojson = useMemo<GeoJSON.FeatureCollection<GeoJSON.LineString>>(
    () => ({
      type: "FeatureCollection",
      features: data.map((arc) => {
        const { from, to, ...properties } = arc;
        return {
          type: "Feature",
          properties,
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
      const arc = data.find((item) => String(item.id) === String(featureId));
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
        id={`arc-hit-${id}`}
        layout={DEFAULT_ARC_LAYOUT}
        paint={{
          "line-color": "rgba(0, 0, 0, 0)",
          "line-width": hitWidth,
          "line-opacity": 1,
        }}
        type="line"
      />
      <Layer
        beforeId={beforeId}
        id={`arc-line-${id}`}
        layout={mergedLayout}
        paint={mergedPaint}
        type="line"
      />
    </GeoJSONSource>
  );
}

function isPointFeature(
  feature: GeoJSON.Feature,
): feature is GeoJSON.Feature<GeoJSON.Point> {
  return feature.geometry.type === "Point";
}

type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  id?: string;
  clusterRadius?: number;
  clusterMaxZoom?: number;
  clusterColors?: [string, string, string];
  clusterThresholds?: [number, number];
  pointColor?: string;
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point, P>,
    coordinates: [number, number],
  ) => void;
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
      onPointClick(feature as GeoJSON.Feature<GeoJSON.Point, P>, [
        longitude,
        latitude,
      ]);
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
            20,
            clusterThresholds[0],
            30,
            clusterThresholds[1],
            40,
          ],
          "circle-stroke-width": 0.75,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.85,
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
        paint={{
          "circle-color": pointColor,
          "circle-radius": 5,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        }}
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
