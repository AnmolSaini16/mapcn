"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirects old /blocks#name links to /blocks/name.
export function BlockHashRedirect({ blockNames }: { blockNames: string[] }) {
  const router = useRouter();

  useEffect(() => {
    function redirect() {
      const name = window.location.hash.slice(1);
      if (blockNames.includes(name)) router.replace(`/blocks/${name}`);
    }

    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [blockNames, router]);

  return null;
}
