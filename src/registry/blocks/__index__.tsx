import React from "react";

import { RegistryBlockItem } from "@/lib/blocks";

export const blockComponents: Record<
  RegistryBlockItem["name"],
  React.LazyExoticComponent<React.ComponentType<object>>
> = {
  "analytics-map": React.lazy(() => import("./analytics-map/page")),
  choropleth: React.lazy(() => import("./choropleth/page")),
  "analytics-card": React.lazy(() => import("./analytics-card/page")),
  "delivery-tracker": React.lazy(() => import("./delivery-tracker/page")),
  "uptime-monitor": React.lazy(() => import("./uptime-monitor/page")),
  heatmap: React.lazy(() => import("./heatmap/page")),
  "logistics-network": React.lazy(() => import("./logistics-network/page")),
  "store-locator": React.lazy(() => import("./store-locator/page")),
};
