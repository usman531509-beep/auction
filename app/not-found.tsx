import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 pt-32 pb-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">404</p>
      <h1 className="text-3xl font-semibold text-ink mt-2">Page not found</h1>
      <p className="text-ink-muted mt-2">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-6"><Link href="/">Go home</Link></Button>
    </div>
  );
}
