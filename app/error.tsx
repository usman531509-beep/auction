"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-32 pb-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Error</p>
      <h1 className="text-3xl font-semibold text-ink mt-2">Something went wrong</h1>
      <p className="text-ink-muted mt-2 break-words">{error.message}</p>
      {error.digest && (
        <p className="text-xs text-ink-muted mt-3 font-mono break-all">digest: {error.digest}</p>
      )}
      {error.stack && (
        <pre className="text-left text-xs bg-gray-100 p-4 mt-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
          {error.stack}
        </pre>
      )}
      <Button onClick={reset} className="mt-6">Try again</Button>
    </div>
  );
}
