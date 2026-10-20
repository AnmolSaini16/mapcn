import { ArrowUpRight } from "lucide-react";

import { CodeCopyButton } from "@/components/code-copy-button";
import { sponsorEmail, xProfileUrl } from "@/lib/sponsors";

export function SponsorCustom() {
  return (
    <section
      aria-labelledby="custom-heading"
      className="bg-muted ring-foreground/5 dark:bg-muted/30 mx-auto w-full max-w-4xl rounded-2xl p-2 ring-1"
    >
      <div className="bg-background ring-foreground/10 dark:ring-foreground/5 grid overflow-hidden rounded-lg shadow-xs ring-1 md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-8 md:p-10">
          <h2
            id="custom-heading"
            className="text-2xl font-semibold tracking-tight text-balance md:text-3xl"
          >
            Need something custom?
          </h2>
          <p className="text-muted-foreground max-w-sm text-[15px] leading-relaxed text-pretty">
            A launch campaign, a different placement, or just a question first.
            Happy to put something together.
          </p>
        </div>

        <div className="flex flex-col divide-y border-t md:border-t-0 md:border-l">
          <div className="flex flex-1 items-center justify-between gap-4 py-5 pr-4 pl-6 sm:pl-8">
            <ContactValue label="Email">{sponsorEmail}</ContactValue>
            <CodeCopyButton
              text={sponsorEmail}
              label="Copy email"
              className="bg-transparent"
            />
          </div>
          <a
            href={xProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:bg-muted/50 flex flex-1 items-center justify-between gap-4 py-5 pr-6 pl-6 transition-colors sm:pl-8"
          >
            <ContactValue label="DM on X">
              @{xProfileUrl.split("/").pop()}
            </ContactValue>
            <ArrowUpRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactValue({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="truncate text-[15px] font-medium">{children}</span>
    </div>
  );
}
