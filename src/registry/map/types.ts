import MapLibreGL from "maplibre-gl";
import { type RefObject } from "react";

export type MapContextValue = {
  map: MapLibreGL.Map | null;
  isLoaded: boolean;
};

export type MarkerContextValue = {
  markerRef: RefObject<MapLibreGL.Marker | null>;
  markerElementRef: RefObject<HTMLDivElement | null>;
  map: MapLibreGL.Map | null;
  isReady: boolean;
};

export const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

export type MapStyleOption = string | MapLibreGL.StyleSpecification;