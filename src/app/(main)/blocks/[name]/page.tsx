import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getBlocksInGridOrder } from "@/lib/blocks";
import { siteBanner } from "@/lib/metadata";
import { BlockCard } from "../_components/block-card";
import { BlockDisplay } from "../_components/block-display";

interface BlockPageProps {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  return getBlocksInGridOrder().map(({ name }) => ({ name }));
}

export async function generateMetadata({
  params,
}: BlockPageProps): Promise<Metadata> {
  const { name } = await params;
  const block = getBlocksInGridOrder().find((block) => block.name === name);
  if (!block) notFound();

  const title = `${block.title} - mapcn`;

  return {
    title: block.title,
    description: block.description,
    openGraph: {
      type: "website",
      siteName: "mapcn",
      url: "./",
      title,
      description: block.description,
      images: [siteBanner],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: block.description,
      images: [siteBanner.url],
    },
  };
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { name } = await params;
  const blocks = getBlocksInGridOrder();
  const index = blocks.findIndex((block) => block.name === name);
  if (index === -1) notFound();

  const block = blocks[index];

  const neighbours = [
    ...new Set([blocks.at(index - 1)!, blocks[(index + 1) % blocks.length]]),
  ].filter((other) => other !== block);

  return (
    <>
      <div className="flex-1">
        <PageHeader align="left" size="sm" className="pb-8 md:pb-10">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground -ml-2.5 w-fit gap-1 hover:bg-transparent!"
          >
            <Link href="/blocks">
              <ChevronLeft />
              All Blocks
            </Link>
          </Button>
          <PageHeaderHeading>{block.title}</PageHeaderHeading>
          {block.description && (
            <PageHeaderDescription className="max-w-4xl">
              {block.description}
            </PageHeaderDescription>
          )}
        </PageHeader>

        <section className="container space-y-20 pb-24">
          <BlockDisplay block={block} />

          {neighbours.length > 0 && (
            <section aria-labelledby="more-blocks" className="space-y-6">
              <h2
                id="more-blocks"
                className="text-foreground text-lg font-medium tracking-tight"
              >
                More blocks
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {neighbours.map((other) => (
                  <BlockCard key={other.name} block={other} />
                ))}
              </div>
            </section>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
