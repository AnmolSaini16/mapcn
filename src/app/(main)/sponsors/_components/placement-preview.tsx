import { cn } from "@/lib/utils";

export function PlacementPreviews() {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
      {placements.map((placement) => (
        <figure
          key={placement.title}
          className="bg-muted ring-foreground/5 dark:bg-muted/30 rounded-2xl p-2 ring-1"
        >
          <div
            aria-hidden
            className="bg-background ring-foreground/10 dark:ring-foreground/5 aspect-[2/1] overflow-hidden rounded-lg p-5 shadow-xs ring-1 md:p-6"
          >
            <placement.preview />
          </div>
          <figcaption className="px-2 pt-3.5 pb-2">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-base font-medium">{placement.title}</h3>
              <span className="text-muted-foreground text-sm">
                {placement.tiers}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {placement.description}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function HomePreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col items-center gap-2">
        <Bar className="h-2 w-2/5" />
        <Bar className="w-1/4" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 mask-b-from-30%">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-muted aspect-[4/3] rounded-sm" />
        ))}
      </div>
      <div className="mt-auto flex flex-col items-center gap-2.5">
        <div className="flex gap-4">
          <Slot className="h-2.5 w-12" />
          <Slot className="h-2.5 w-12" />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Slot key={i} className="h-2 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}

function DocsPreview() {
  return (
    <div className="grid h-full grid-cols-[1fr_3fr_1fr] gap-5">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Bar key={i} className={i % 2 === 0 ? "w-full" : "w-2/3"} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Bar className="h-2 w-1/2" />
        <Bar className="w-5/6" />
        <div className="bg-muted mt-2 h-2/5 rounded-sm" />
      </div>
      <div className="flex flex-col gap-2">
        <Bar className="w-full" />
        <Bar className="w-2/3" />
        <Slot className="mt-4 h-2.5 w-3/4" />
        <Slot className="h-2.5 w-3/4" />
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Slot className="h-2" />
          <Slot className="h-2" />
        </div>
      </div>
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return <div className={cn("bg-muted h-1.5 rounded-full", className)} />;
}

function Slot({ className }: { className?: string }) {
  return <div className={cn("bg-foreground/20 rounded-full", className)} />;
}

const placements = [
  {
    title: "Homepage",
    tiers: "Platinum · Gold",
    description:
      "Right below the map showcase, seen by everyone exploring mapcn.",
    preview: HomePreview,
  },
  {
    title: "Every docs page",
    tiers: "Platinum · Gold",
    description:
      "Beside every page developers read, right under the table of contents.",
    preview: DocsPreview,
  },
];
