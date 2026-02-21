import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-5 border-t">
      <div className="w-full container flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">mapcn</span>
          <span className="text-muted-foreground/80">•</span>
          <span>
            Built by
            <Button variant="link" size="sm" className="px-1" asChild>
              <Link
                href="https://github.com/AnmolSaini16"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anmol
              </Link>
            </Button>
          </span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Documentation</Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://github.com/AnmolSaini16/mapcn"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
