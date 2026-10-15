import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import {
  getAllBlocks,
  getBlockCategories,
  type BlockCategory,
} from "@/lib/blocks";
import { BlockCard } from "./_components/block-card";
import { BlockDisplay } from "./_components/block-display";
import {
  BlocksView,
  BlocksViewProvider,
  BlocksViewSwitch,
} from "./_components/blocks-view";
import { type CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Map Blocks",
  description:
    "Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one command.",
};

export default async function Page() {
  const blocks = getAllBlocks();
  const categories = getBlockCategories();

  return (
    <BlocksViewProvider blockNames={blocks.map((block) => block.name)}>
      <PageHeader
        align="left"
        size="sm"
        className="md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-col gap-3">
          <PageHeaderHeading>Blocks</PageHeaderHeading>
          <PageHeaderDescription className="max-w-4xl">
            Ready-to-use map blocks. Browse, preview, and copy them into your
            app with one command.
          </PageHeaderDescription>
        </div>
        <PageActions className="mt-0">
          <BlocksViewSwitch />
        </PageActions>
      </PageHeader>

      <section
        className="animate-fade-up animate-stagger container scroll-mt-20 space-y-20 pb-24"
        id="blocks"
        style={
          {
            "--stagger": 4,
          } as CSSProperties
        }
      >
        <BlocksView mode="grid">
          <div className="space-y-16">
            {categories.map((category) => (
              <CategorySection key={category.slug} category={category}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {category.blocks.map((block) => (
                    <BlockCard key={block.name} block={block} />
                  ))}
                </div>
              </CategorySection>
            ))}
          </div>
        </BlocksView>

        <BlocksView mode="single">
          <div className="space-y-20">
            {categories
              .flatMap((category) => category.blocks)
              .map((block) => (
                <BlockDisplay key={block.name} block={block} />
              ))}
          </div>
        </BlocksView>
      </section>

      <Footer />
    </BlocksViewProvider>
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
