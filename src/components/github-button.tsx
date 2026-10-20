import Link from "next/link";
import { GitHubIcon } from "@/components/github-icon";
import { githubRepoUrl } from "@/lib/site-navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function GitHubButton({ withCount = true }: { withCount?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-muted-foreground hover:text-foreground font-normal"
    >
      <Link
        href={githubRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="mapcn on GitHub"
      >
        <GitHubIcon />
        {withCount && (
          <Suspense fallback={<Skeleton className="h-4 w-6 rounded" />}>
            <StarCount />
          </Suspense>
        )}
      </Link>
    </Button>
  );
}

export async function getStarCount() {
  let count: number | undefined;
  try {
    const response = await fetch(
      "https://api.github.com/repos/AnmolSaini16/mapcn",
      { next: { revalidate: 60 } },
    );
    if (!response.ok) return null;
    count = (await response.json()).stargazers_count;
  } catch {
    return null;
  }
  if (typeof count !== "number") return null;

  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
}

export async function StarCount() {
  const formattedCount = await getStarCount();

  return (
    <>
      {formattedCount && (
        <span className="pt-0.5 text-xs tabular-nums">{formattedCount}</span>
      )}
    </>
  );
}
