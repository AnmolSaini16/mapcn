import fs from "fs";
import path from "path";

const EXAMPLES_DIR = path.join(
  process.cwd(),
  "src/app/(main)/docs/_components/examples",
);

export function getExampleSource(filename: string): string {
  const filePath = path.join(EXAMPLES_DIR, filename);
  const source = fs.readFileSync(filePath, "utf-8");

  return source.replace(/@\/registry\/map/g, "@/components/ui/map");
}
