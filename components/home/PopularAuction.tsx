"use client";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useScrollAnimation } from "./useScrollAnimation";
import SectionHeading from "./SectionHeading";

type AuctionItem = {
  _id: string;
  title: string;
  brand: string;
  images: string[];
  currentPrice: number;
  endTime: string;
  status: string;
};

export default function PopularAuction({ auctions }: { auctions: AuctionItem[] }) {
  const sectionRef = useScrollAnimation();

  if (auctions.length === 0) return null;

  // Sort by price descending for "highest bidding"
  const sorted = [...auctions].sort((a, b) => b.currentPrice - a.currentPrice);
  const topThree = sorted.slice(0, 3);
  const popular = sorted.slice(3, 9);

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-cream py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          {/* Highest Bidding sidebar */}
          <div>
            <h3 className="text-2xl font-bold text-ink mb-1">
              Highest <span className="italic font-normal text-ink-soft">Bidding.</span>
            </h3>
            <div className="mt-6 space-y-4">
              {topThree.map((auction) => (
                <Link
                  key={auction._id}
                  href={`/auctions/${auction._id}`}
                  className="block bg-white rounded-xl p-4 border border-line hover:shadow-lift transition-all duration-300 hover:-translate-y-0.5"
                >
                  <h4 className="font-medium text-ink text-sm line-clamp-2">{auction.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] text-ink-muted">Current Bid at</span>
                      <p className="text-lg font-bold text-ink">{formatPrice(auction.currentPrice)}</p>
                    </div>
                    <Badge className="bg-red-500 text-white text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Live
                      </span>
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular grid */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <SectionHeading title="Popular Auction" highlight="For You." />
              <Link
                href="/auctions"
                className="text-sm text-ink hover:text-accent transition-colors underline underline-offset-4"
              >
                View All Auction
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((auction) => {
                const img = auction.images[0] ?? `https://picsum.photos/seed/${auction._id}/600/400`;
                return (
                  <Link
                    key={auction._id}
                    href={`/auctions/${auction._id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                        <SafeImage
                          src={img}
                          alt={auction.title}
                          fill
                          sizes="(max-width:768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 text-white text-[10px]">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                              Live
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-ink text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                          {auction.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-ink-muted">Current Bid at</span>
                            <p className="text-base font-bold text-ink">
                              {formatPrice(auction.currentPrice)}
                            </p>
                          </div>
                          <span className="px-4 py-2 rounded-lg text-xs font-medium bg-white border border-ink text-ink hover:bg-ink hover:text-white transition-colors">
                            Bid Now
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
    </section>
  );
}
