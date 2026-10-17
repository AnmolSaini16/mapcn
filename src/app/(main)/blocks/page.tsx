import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import {
  getBlockCategories,
  getBlocksInGridOrder,
  type BlockCategory,
} from "@/lib/blocks";
import { BlockCard } from "./_components/block-card";
import { BlockHashRedirect } from "./_components/block-hash-redirect";

export const metadata: Metadata = {
  title: "Map Blocks",
  description:
    "Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one command.",
};

export default function Page() {
  const categories = getBlockCategories();

  return (
    <>
      <BlockHashRedirect
        blockNames={getBlocksInGridOrder().map((block) => block.name)}
      />

      <div className="flex-1">
        <PageHeader align="left" size="sm">
          <PageHeaderHeading>Blocks</PageHeaderHeading>
          <PageHeaderDescription className="max-w-4xl">
            Ready-to-use map blocks. Browse, preview, and copy them into your
            app with one command.
          </PageHeaderDescription>
        </PageHeader>

        <section className="container space-y-16 pb-24">
          {categories.map((category) => (
            <CategorySection key={category.slug} category={category}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {category.blocks.map((block) => (
                  <BlockCard key={block.name} block={block} />
                ))}
              </div>
            </CategorySection>
          ))}
        </section>
      </div>

      <Footer />
    </>
  );
}

function CategorySection({
  category: { slug, title, blocks },
  children,
}: {
  category: BlockCategory;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`category-${slug}`} className="space-y-6">
      <h2
        id={`category-${slug}`}
        className="text-foreground flex items-baseline gap-2 text-lg font-medium tracking-tight"
      >
        {title}
        <span className="text-muted-foreground font-mono text-sm font-normal">
          {blocks.length}
        </span>
      </h2>
      {children}
    </section>
  );
}
