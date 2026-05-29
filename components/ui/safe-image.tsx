"use client";
import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";

export default function SafeImage({ src, alt, fallback, ...rest }: ImageProps & { fallback?: string }) {
  const srcStr = typeof src === "string" ? src : String(src);
  const [current, setCurrent] = useState<string>(srcStr);
  const fb = fallback ?? `https://picsum.photos/seed/${encodeURIComponent(srcStr)}/1200/700`;

  useEffect(() => {
    setCurrent(srcStr);
  }, [srcStr]);

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
