"use client";

const messages = [
  "We believe in the power of collaboration",
  "We invite you to join us on this exciting journey",
  "Welcome to クルマリンク Auctions",
  "We thrive on creativity and integrity",
  "Premium vehicles at transparent prices",
  "Trusted by thousands of car enthusiasts",
];

export default function MarqueeBanner() {
  return (
    <div className="bg-ink py-4 overflow-hidden">
      <div className="marquee-track flex animate-marquee whitespace-nowrap">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="flex items-center mx-8 text-sm text-white/90 font-medium">
            <span className="h-2 w-2 rounded-full bg-accent mr-4 flex-shrink-0" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
