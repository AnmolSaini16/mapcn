import fs from "fs";
import path from "path";

// Registry file paths start with "src/". Joining under a fixed "src" folder
// keeps the bundler's file tracing scoped to it instead of the whole project.
const SRC_DIR = path.join(process.cwd(), "src");

export function getBlockFileSource(registryPath: string): string {
  const filePath = path.join(SRC_DIR, path.relative("src", registryPath));
  const source = fs.readFileSync(filePath, "utf-8");

  return source.replace(/@\/registry\/map/g, "@/components/ui/map");
}
