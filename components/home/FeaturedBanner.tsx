"use client";
import Link from "next/link";
import { useScrollAnimation } from "./useScrollAnimation";
import CountdownTimer from "@/components/auctions/CountdownTimer";
import { formatPrice } from "@/lib/utils";

type AuctionItem = {
  _id: string;
  title: string;
  images: string[];
  currentPrice: number;
  endTime: string;
};

export default function FeaturedBanner({ auction }: { auction: AuctionItem | null }) {
  const sectionRef = useScrollAnimation();

  if (!auction) return null;

  const img =
    auction.images[0] ??
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop";

  return (
    <section ref={sectionRef} className="animate-on-scroll-scale relative min-h-[70vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${img}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-md bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <span className="text-xs text-white/60 uppercase tracking-wider">Current Bid at</span>
          <p className="text-3xl font-bold text-white mt-1">
            {formatPrice(auction.currentPrice)}
          </p>

          <h2 className="text-xl font-semibold text-white mt-4 leading-snug">
            Sight of pace where efficiency converges.
          </h2>

          <div className="mt-6">
            <span className="text-xs text-white/60 block mb-2 italic">Auction Will Be End:</span>
            <CountdownTimer endTime={auction.endTime} className="text-white text-sm" />
          </div>

          <Link
            href={`/auctions/${auction._id}`}
            className="inline-flex items-center gap-2 mt-6 bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-lg font-medium transition-all hover:shadow-lift-lg hover:-translate-y-0.5"
          >
            Bid Now
          </Link>
        </div>
      </div>
    </section>
  );
}
