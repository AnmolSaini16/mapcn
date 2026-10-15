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
      className="bg-muted/50 hover:bg-muted ring-foreground/5 focus-visible:ring-ring/50 dark:bg-muted/30 dark:hover:bg-muted/50 block rounded-2xl p-2 ring-1 transition-[background-color,box-shadow] outline-none focus-visible:ring-[3px]"
    >
      <div className="bg-background ring-foreground/5 relative aspect-[16/10] overflow-hidden rounded-lg shadow-xs ring-1">
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

      <div className="min-w-0 px-2 pt-3.5 pb-2">
        <h3 className="truncate text-base font-medium">{title}</h3>
        {block.description && (
          <p className="text-muted-foreground mt-0.5 truncate text-sm">
            {block.description}
          </p>
        )}
      </div>
    </OpenBlockLink>
  );
}

const THUMBNAIL_SIZES = "(min-width: 768px) 50vw, 100vw";
