import registry from "../../registry.json";

export interface RegistryBlockItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files?: { path: string; target?: string }[];
  registryDependencies?: string[];
  categories?: string[];
  meta?: { iframeHeight?: string };
}

interface RegistrySchema {
  items: RegistryBlockItem[];
}

export interface FileTree {
  name: string;
  path?: string;
  children?: FileTree[];
}

const typedRegistry = registry as RegistrySchema;

// shadcn target placeholders (e.g. "@lib/") resolve to the consumer's aliases
// at install time. For the docs file tree, show them as friendly folder names.
const TARGET_PLACEHOLDERS: Record<string, string> = {
  "@components/": "components/",
  "@ui/": "components/ui/",
  "@lib/": "lib/",
  "@hooks/": "hooks/",
};

function displayTarget(target?: string): string | undefined {
  if (!target) return target;
  for (const [prefix, replacement] of Object.entries(TARGET_PLACEHOLDERS)) {
    if (target.startsWith(prefix)) {
      return replacement + target.slice(prefix.length);
    }
  }
  return target;
}

export function getAllBlocks(): RegistryBlockItem[] {
  return typedRegistry.items
    .filter((item) => item.type === "registry:block")
    .map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title ?? item.name,
      description: item.description,
      files: (item.files ?? []).map((file) => ({
        ...file,
        target: displayTarget(file.target),
      })),
      registryDependencies: item.registryDependencies ?? [],
      categories: item.categories ?? [],
      meta: item.meta,
    }));
}

export function createFileTreeForRegistryItemFiles(
  files: { path: string; target?: string }[],
): FileTree[] {
  const root: FileTree[] = [];

  for (const file of files) {
    const filePath = file.target ?? file.path;
    const parts = filePath.split("/");
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (isFile) {
          existingNode.path = filePath;
        } else {
          currentLevel = existingNode.children!;
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path: filePath }
          : { name: part, children: [] };

        currentLevel.push(newNode);

        if (!isFile) {
          currentLevel = newNode.children!;
        }
      }
    }
  }

  return root;
}
