/* TODO: update prompts to use the new mapcn react native API */

export const mapInstallCommand = "npx shadcn@latest add @mapcn/map";

export const mapInstallAgentPrompt = `Read the mapcn agent instructions at https://mapcn.dev/llms.txt, then install mapcn in this project. Run ${mapInstallCommand}. Then add a basic example that imports Map and MapControls from "@/components/ui/map" and renders a map inside a sized container. Use the default tiled basemap for maps that need streets, labels, or geographic context. If the user wants a blank/data-only map, such as countries or country borders, use <Map blank> with MapGeoJSON and either a user-provided GeoJSON URL/object or a world countries GeoJSON source. Preserve the existing Tailwind CSS and shadcn/ui setup. Do not manually rewrite the registry component unless the command fails; if it fails, inspect https://mapcn.dev/r/map.json and install the listed dependencies.`;
