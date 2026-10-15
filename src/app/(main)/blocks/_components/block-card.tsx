import type { RegistryBlockItem } from "@/lib/blocks";
import { BlockThumbnail } from "./block-thumbnail";
import { OpenBlockLink } from "./blocks-view";

interface BlockCardProps {
  block: RegistryBlockItem;
}

export function BlockCard({ block }: BlockCardProps) {
  const title = block.title ?? block.name;

  return (
    <article className="bg-muted/30 dark:hover:bg-muted/40 hover:bg-muted/80 has-[a:focus-visible]:border-ring has-[a:focus-visible]:ring-ring/50 relative rounded-xl border p-1.5 transition-[color,background-color,box-shadow] has-[a:focus-visible]:ring-[3px]">
      <div className="bg-background overflow-hidden rounded-md border">
        <BlockThumbnail src={`/view/${block.name}`} title={title} />
      </div>

      <div className="min-w-0 px-3 pt-3.5 pb-2.5">
        <h3 className="text-base font-medium tracking-tight">
          <OpenBlockLink
            name={block.name}
            className="inline-block max-w-full truncate text-left align-top outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']"
          >
            {title}
          </OpenBlockLink>
        </h3>
        {block.description && (
          <p className="text-muted-foreground mt-1 truncate text-sm">
            {block.description}
          </p>
        )}
      </div>
    </article>
  );
}
