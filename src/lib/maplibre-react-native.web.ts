import type { Geometry } from "geojson";
import type { ReactNode } from "react";

type PressEventWithFeatures = {
  features?: {
    properties?: Record<string, unknown> | null;
    geometry?: Geometry;
  }[];
  coordinates?: { longitude: number; latitude: number };
};

function GeoJSONSource(_props: {
  id?: string;
  data?: unknown;
  children?: ReactNode;
  cluster?: boolean;
  clusterRadius?: number;
  clusterMaxZoom?: number;
}) {
  return null;
}

function Layer(_props: {
  id?: string;
  type?: string;
  source?: string;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  filter?: unknown;
  maxZoom?: number;
  minZoom?: number;
  children?: ReactNode;
}) {
  return null;
}

export { GeoJSONSource, Layer };
export type { PressEventWithFeatures };
