import { mkdir } from "fs/promises";
import path from "path";
import { chromium } from "playwright";
import registry from "../registry.json";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = path.join(process.cwd(), "public", "blocks");
const viewport = { width: 1280, height: 800 };
const schemes = ["light", "dark"] as const;

const only = process.argv.slice(2);
const blocks = registry.items
  .filter((item) => item.type === "registry:block")
  .map((item) => item.name)
  .filter((name) => only.length === 0 || only.includes(name));

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  for (const scheme of schemes) {
    const context = await browser.newContext({
      viewport,
      colorScheme: scheme,
    });
    const page = await context.newPage();

    for (const name of blocks) {
      await page.goto(`${baseUrl}/view/${name}`, { waitUntil: "load" });
      await page.addStyleTag({
        content: "nextjs-portal { display: none !important; }",
      });
      await page.waitForSelector(".maplibregl-canvas", { timeout: 15_000 });
      await page
        .waitForLoadState("networkidle", { timeout: 10_000 })
        .catch(() => {});
      await page.waitForTimeout(1_500);

      const file = path.join(outDir, `${name}-${scheme}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 85 });
      console.log(`✓ ${path.relative(process.cwd(), file)}`);
    }

    await context.close();
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
