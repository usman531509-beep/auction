"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";

export default function SafeImage({ src, alt, fallback, ...rest }: ImageProps & { fallback?: string }) {
  const [current, setCurrent] = useState<string>(typeof src === "string" ? src : String(src));
  const fb = fallback ?? `https://picsum.photos/seed/${encodeURIComponent(String(current))}/1200/700`;
  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fb) setCurrent(fb);
      }}
    />
  );
}
