import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThemedImageProps {
  /** Path without the `-light.jpg` / `-dark.jpg` suffix. */
  src: string;
  sizes: string;
  className?: string;
}

export function ThemedImage({ src, sizes, className }: ThemedImageProps) {
  return (
    <>
      <Image
        src={`${src}-light.jpg`}
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className={cn("object-cover select-none dark:hidden", className)}
      />
      <Image
        src={`${src}-dark.jpg`}
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className={cn("hidden object-cover select-none dark:block", className)}
      />
    </>
  );
}
