import fs from "fs";
import path from "path";

const EXAMPLES_DIR = path.join(
  process.cwd(),
  "src/app/docs/_components/examples"
);

export function getExampleSource(filename: string): string {
  const filePath = path.join(EXAMPLES_DIR, filename);
  const source = fs.readFileSync(filePath, "utf-8");

  // Clean up the source for display:
  return source
    .replace(/@\/registry\/map/g, "@/components/ui/map")
    .replace(/@\/registry\/google-map-route/g, "@/components/ui/google-map-route");
}
