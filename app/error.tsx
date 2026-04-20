"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-32 pb-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Error</p>
      <h1 className="text-3xl font-semibold text-ink mt-2">Something went wrong</h1>
      <p className="text-ink-muted mt-2 break-words">{error.message}</p>
      <Button onClick={reset} className="mt-6">Try again</Button>
    </div>
  );
}
