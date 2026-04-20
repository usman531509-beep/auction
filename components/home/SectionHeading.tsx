"use client";

export default function SectionHeading({
  title,
  highlight,
  className = "",
}: {
  title: string;
  highlight: string;
  className?: string;
}) {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold text-ink ${className}`}>
      {title} <span className="italic font-normal text-ink-soft">{highlight}</span>
    </h2>
  );
}
