import { slugToTitle } from "@/lib/utils";
import { blockComponents } from "@/registry/blocks/__index__";
import { notFound } from "next/navigation";

interface BlockViewPageProps {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  return Object.keys(blockComponents).map((name) => ({ name }));
}

export const generateMetadata = async ({ params }: BlockViewPageProps) => {
  const { name } = await params;
  const Component = blockComponents[name];

  if (!Component) {
    return notFound();
  }

  const title = slugToTitle(name);

  return {
    title,
    description: `View the ${title} block`,
  };
};

export default async function BlockViewPage({ params }: BlockViewPageProps) {
  const { name } = await params;
  const Component = blockComponents[name];

  if (!Component) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <Component />
    </div>
  );
}
