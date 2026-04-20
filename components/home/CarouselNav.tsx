"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselNav({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="h-10 w-10 rounded-full border border-line bg-white flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5 text-ink" />
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="h-10 w-10 rounded-full border border-line bg-white flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5 text-ink" />
      </button>
    </div>
  );
}
