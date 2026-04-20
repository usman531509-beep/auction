"use client";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import SafeImage from "@/components/ui/safe-image";
import CountdownTimer from "@/components/auctions/CountdownTimer";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useScrollAnimation } from "./useScrollAnimation";
import SectionHeading from "./SectionHeading";
import CarouselNav from "./CarouselNav";

type AuctionItem = {
  _id: string;
  title: string;
  brand: string;
  images: string[];
  currentPrice: number;
  endTime: string;
  status: string;
};

export default function LatestAuction({ auctions }: { auctions: AuctionItem[] }) {
  const sectionRef = useScrollAnimation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (auctions.length === 0) return null;

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading title="Latest" highlight="Auction" />
          <CarouselNav onPrev={scrollPrev} onNext={scrollNext} />
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-5">
            {auctions.map((auction) => {
              const img = auction.images[0] ?? `https://picsum.photos/seed/${auction._id}/600/400`;
              const isLive = auction.status === "active";
              return (
                <Link
                  key={auction._id}
                  href={`/auctions/${auction._id}`}
                  className="flex-shrink-0 basis-[calc(25%-15px)] min-w-[260px] group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                      <SafeImage
                        src={img}
                        alt={auction.title}
                        fill
                        sizes="(max-width:768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant={isLive ? "default" : "secondary"}
                          className={isLive ? "bg-red-500 text-white" : "bg-white/90 text-ink"}
                        >
                          {isLive ? (
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                              Live
                            </span>
                          ) : (
                            "Upcoming"
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <CountdownTimer endTime={auction.endTime} className="text-xs" />
                      </div>
                      <h3 className="font-medium text-ink text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                        {auction.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-ink-muted block">Current Bid at</span>
                          <span className="text-lg font-bold text-ink">
                            {formatPrice(auction.currentPrice)}
                          </span>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isLive
                              ? "bg-accent text-white hover:bg-accent-hover"
                              : "bg-surface text-ink-muted border border-line"
                          }`}
                        >
                          {isLive ? "Bid Now" : "Notify Me"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent transition-colors underline underline-offset-4"
          >
            View All Auction
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
