"use client";
import { useEffect, useState } from "react";
import { timeLeft } from "@/lib/utils";

export default function CountdownTimer({ endTime, className }: { endTime: string | Date; className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(timeLeft(endTime));
    const id = setInterval(() => setLabel(timeLeft(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const ended = label === "Ended";
  return (
    <span
      suppressHydrationWarning
      className={
        (className ?? "") +
        " inline-flex items-center gap-1 text-xs font-medium " +
        (label === null ? "text-ink-muted" : ended ? "text-ink-muted" : "text-accent")
      }
    >
      <span
        className={
          "inline-block h-1.5 w-1.5 rounded-full " +
          (label === null || ended ? "bg-ink-muted" : "bg-accent animate-pulse")
        }
      />
      {label ?? "—"}
    </span>
  );
}
