import fs from "fs";
import path from "path";

const THUMBNAIL_DIR = path.join(process.cwd(), "public", "blocks");

export interface BlockThumbnails {
  light: string;
  dark: string;
}

// Screenshots come from `npm run blocks:thumbnails`. A block without both
// variants returns null so the card can fall back to a live preview.
export function getBlockThumbnails(name: string): BlockThumbnails | null {
  const light = `${name}-light.jpg`;
  const dark = `${name}-dark.jpg`;

  if (
    !fs.existsSync(path.join(THUMBNAIL_DIR, light)) ||
    !fs.existsSync(path.join(THUMBNAIL_DIR, dark))
  ) {
    return null;
  }

  return { light: `/blocks/${light}`, dark: `/blocks/${dark}` };
}
