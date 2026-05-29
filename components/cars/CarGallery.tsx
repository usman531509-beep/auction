"use client";
import { useState } from "react";
import SafeImage from "@/components/ui/safe-image";
import { Card } from "@/components/ui/card";

export default function CarGallery({ images, title }: { images: string[]; title: string }) {
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/700`;
  const pics = images.length > 0 ? images : [fallback];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/10] bg-surface">
          <SafeImage
            src={pics[active] ?? fallback}
            alt={title}
            fill
            sizes="(max-width:1024px) 100vw, 66vw"
            className="object-cover"
            priority
          />
        </div>
      </Card>

      {pics.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {pics.slice(0, 5).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                active === i
                  ? "border-accent shadow-lift"
                  : "border-line hover:border-accent/40"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <SafeImage
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
