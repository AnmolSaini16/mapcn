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
            <h3 className="text-base font-medium">{placement.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">
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
        <Heading className="w-2/5" />
        <Bar className="w-1/4" />
        <div className="mt-1 flex gap-1.5">
          <div className="bg-foreground/15 h-2.5 w-9 rounded-full" />
          <div className="bg-muted h-2.5 w-9 rounded-full" />
        </div>
      </div>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-3 gap-2 mask-b-from-30%">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-muted rounded-md" />
        ))}
      </div>
      <div className="mx-auto mt-3 grid w-1/2 grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Slot key={i} />
        ))}
      </div>
    </div>
  );
}

function DocsPreview() {
  return (
    <div className="grid h-full grid-cols-[1fr_3fr_1fr] gap-5">
      <div className="flex flex-col gap-2">
        <Label />
        <Bar className="w-full" />
        <Bar className="w-2/3" />
        <Label className="mt-2" />
        <Bar className="w-full" />
        <Bar className="w-3/4" />
      </div>
      <div className="flex flex-col gap-2">
        <Heading className="w-1/2" />
        <Bar className="w-5/6" />
        <Bar className="w-2/3" />
        <div className="bg-muted mt-2 min-h-0 flex-1 rounded-md mask-b-from-30%" />
      </div>
      <div className="flex flex-col gap-2">
        <Label />
        <Bar className="w-full" />
        <Bar className="w-2/3" />
        <Slot className="mt-3" />
        <Slot />
        <Slot />
      </div>
    </div>
  );
}

function Heading({ className }: { className?: string }) {
  return <div className={cn("bg-foreground/15 h-2 rounded-full", className)} />;
}

function Label({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-foreground/10 h-1.5 w-1/2 rounded-full", className)}
    />
  );
}

function Bar({ className }: { className?: string }) {
  return <div className={cn("bg-muted h-1.5 rounded-full", className)} />;
}

function Slot({ className }: { className?: string }) {
  return (
    <div className={cn("bg-foreground/40 h-2.5 rounded-full", className)} />
  );
}

const placements = [
  {
    title: "Homepage",
    description:
      "Right below the map showcase, seen by everyone exploring mapcn.",
    preview: HomePreview,
  },
  {
    title: "Every docs page",
    description:
      "Beside every page developers read, right under the table of contents.",
    preview: DocsPreview,
  },
];
