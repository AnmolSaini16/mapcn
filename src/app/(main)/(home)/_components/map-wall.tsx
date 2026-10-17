import { ThemedImage } from "@/components/themed-image";
import { cn } from "@/lib/utils";
import sizes from "./showcase-sizes.json";

export function MapWall({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none relative left-1/2 flex w-[40rem] -translate-x-1/2 gap-3 select-none md:left-0 md:mx-auto md:w-[calc(100%-8rem)] md:max-w-[84rem] md:translate-x-0 md:gap-4 xl:w-[calc(100%-12rem)] xl:gap-6",
        className,
      )}
    >
      <Rail
        columns={LEFT_RAIL}
        className="right-full mr-4 mask-l-from-50% xl:mr-6"
      />

      {MAIN.map((column, index) => (
        <div
          key={index}
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-3 md:gap-4 xl:gap-6",
            index !== 1 && "mt-6 md:mt-8",
            index === 2 && "md:max-xl:hidden",
          )}
        >
          {column.map((name, row) => (
            <Tile key={`${name}-${row}`} name={name} sizes={MAIN_SIZES} />
          ))}
        </div>
      ))}

      <Rail
        columns={RIGHT_RAIL}
        className="left-full ml-4 mask-r-from-50% xl:ml-6"
      />
    </div>
  );
}

// Its own layer keeps the blur from being redrawn while the section animates
// in, and since the tiles are blurred, small images are enough.
function Rail({
  columns,
  className,
}: {
  columns: TileName[][];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute top-0 hidden transform-gpu gap-4 opacity-70 blur-[3px] md:flex xl:gap-6",
        className,
      )}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className="flex w-60 flex-col gap-4 xl:gap-6"
          style={{ marginTop: `${RAIL_OFFSETS[index]}rem` }}
        >
          {column.map((name, row) => (
            <Tile key={`${name}-${row}`} name={name} sizes="8rem" />
          ))}
        </div>
      ))}
    </div>
  );
}

function Tile({ name, sizes: imageSizes }: { name: TileName; sizes: string }) {
  const { width, height } = sizes[name];

  return (
    <div
      className="bg-muted ring-foreground/10 relative overflow-hidden rounded-xl ring-1"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <ThemedImage src={`/showcase/${name}`} sizes={imageSizes} />
    </div>
  );
}

const MAIN_SIZES = "(min-width: 1280px) 27rem, (min-width: 768px) 50vw, 13rem";

const RAIL_OFFSETS = [3, 6];

const MAIN: TileName[][] = [
  ["analytics-map", "route-alternatives", "heatmap", "analytics-card"],
  ["logistics-network", "choropleth", "clusters", "route-alternatives"],
  ["delivery-tracker", "globe", "uptime-monitor", "choropleth"],
];

// Ordered left to right, so the outer column of the left rail comes first.
const LEFT_RAIL: TileName[][] = [
  ["popup", "custom-layer", "route", "geojson-overlay", "arcs"],
  ["marker-popup", "geojson-overlay", "arcs", "route-progress", "popup"],
];

const RIGHT_RAIL: TileName[][] = [
  ["route", "arcs", "popup", "marker-popup", "custom-layer"],
  [
    "geojson-overlay",
    "route-progress",
    "custom-layer",
    "route",
    "marker-popup",
  ],
];

type TileName = keyof typeof sizes;
