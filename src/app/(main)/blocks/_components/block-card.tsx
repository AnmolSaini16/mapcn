import Image from "next/image";
import type { RegistryBlockItem } from "@/lib/blocks";
import { OpenBlockLink } from "./blocks-view";

interface BlockCardProps {
  block: RegistryBlockItem;
}

export function BlockCard({ block }: BlockCardProps) {
  const title = block.title ?? block.name;

  return (
    <OpenBlockLink
      name={block.name}
      className="bg-muted/30 dark:hover:bg-muted/40 hover:bg-muted/80 focus-visible:border-ring focus-visible:ring-ring/50 block rounded-xl border p-1.5 transition-[color,background-color,box-shadow] outline-none focus-visible:ring-[3px]"
    >
      <div className="bg-muted/40 border-border/50 relative aspect-[16/10] overflow-hidden rounded-md border">
        <Image
          src={`/blocks/${block.name}-light.jpg`}
          alt=""
          fill
          sizes={THUMBNAIL_SIZES}
          className="object-cover dark:hidden"
        />
        <Image
          src={`/blocks/${block.name}-dark.jpg`}
          alt=""
          fill
          sizes={THUMBNAIL_SIZES}
          className="hidden object-cover dark:block"
        />
      </div>

      <div className="min-w-0 px-3 pt-3.5 pb-2.5">
        <h3 className="truncate text-base font-medium tracking-tight">
          {title}
        </h3>
        {block.description && (
          <p className="text-muted-foreground mt-1 truncate text-sm">
            {block.description}
          </p>
        )}
      </div>
    </OpenBlockLink>
  );
}

const THUMBNAIL_SIZES = "(min-width: 768px) 50vw, 100vw";
