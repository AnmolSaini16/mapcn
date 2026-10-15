import Link from "next/link";
import { GitHubIcon } from "@/components/github-icon";
import { githubRepoUrl } from "@/lib/site-navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function GitHubButton({ withCount = true }: { withCount?: boolean }) {
  return (
    <Button variant="ghost" size="sm" asChild>
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

export async function StarCount() {
  const response = await fetch(
    "https://api.github.com/repos/AnmolSaini16/mapcn",
    { next: { revalidate: 60 } },
  );

  const data = await response.json();

  const formattedCount =
    data.stargazers_count >= 1000
      ? `${(data.stargazers_count / 1000).toFixed(1)}k`
      : data.stargazers_count;

  return (
    <>
      {formattedCount && (
        <span className="text-muted-foreground pt-0.5 text-xs tabular-nums">
          {formattedCount}
        </span>
      )}
    </>
  );
}
