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

export default function UpcomingAuction({ auctions }: { auctions: AuctionItem[] }) {
  const sectionRef = useScrollAnimation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (auctions.length === 0) return null;

  const featured = auctions[0];
  const rest = auctions.slice(1);
  const featuredImg = featured.images[0] ?? `https://picsum.photos/seed/${featured._id}/600/400`;

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Featured card on left */}
          <Link href={`/auctions/${featured._id}`} className="group">
            <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lift transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <SafeImage
                  src={featuredImg}
                  alt={featured.title}
                  fill
                  sizes="320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] text-ink-muted">Current Bid at</span>
                <p className="text-2xl font-bold text-accent mt-0.5">
                  {formatPrice(featured.currentPrice)}
                </p>
                <h3 className="font-semibold text-ink mt-3 text-sm leading-snug">
                  {featured.title}
                </h3>
                <div className="mt-3">
                  <CountdownTimer endTime={featured.endTime} className="text-xs" />
                </div>
                <span className="inline-block mt-4 bg-accent text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-accent-hover transition-colors">
                  Bid Now
                </span>
              </div>
            </div>
          </Link>

          {/* Right carousel */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <SectionHeading title="Upcoming" highlight="Auction" />
              <CarouselNav onPrev={scrollPrev} onNext={scrollNext} />
            </div>

            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-5">
                {rest.map((auction) => {
                  const img = auction.images[0] ?? `https://picsum.photos/seed/${auction._id}/600/400`;
                  return (
                    <Link
                      key={auction._id}
                      href={`/auctions/${auction._id}`}
                      className="flex-shrink-0 basis-[calc(33.333%-14px)] min-w-[220px] group"
                    >
                      <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                          <SafeImage
                            src={img}
                            alt={auction.title}
                            fill
                            sizes="(max-width:768px) 100vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white/90 text-ink text-[10px]">
                              <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Upcoming
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <CountdownTimer endTime={auction.endTime} className="text-xs" />
                          </div>
                          <h3 className="font-medium text-ink text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                            {auction.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[11px] text-ink-muted block">Current Bid at</span>
                              <span className="text-base font-bold text-ink">
                                {formatPrice(auction.currentPrice)}
                              </span>
                            </div>
                            <span className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-surface text-ink-muted border border-line">
                              Notify Me
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
