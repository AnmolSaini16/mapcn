"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center w-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We apologize for the inconvenience. Please try again or return to the
        home page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Button
          onClick={() => (reset ? reset() : router.refresh())}
          variant="outline"
          className="w-full md:w-auto"
        >
          <span className="flex flex-row items-center gap-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </span>
        </Button>
        <Button asChild className="w-full md:w-auto font-sans">
          <Link href="/" className="flex flex-row items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
