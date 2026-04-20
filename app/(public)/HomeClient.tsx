"use client";
import HeroSection from "@/components/home/HeroSection";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import CategorySection from "@/components/home/CategorySection";
import LatestAuction from "@/components/home/LatestAuction";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import UpcomingAuction from "@/components/home/UpcomingAuction";
import PopularAuction from "@/components/home/PopularAuction";
import WorkProcess from "@/components/home/WorkProcess";
import FAQSection from "@/components/home/FAQSection";

type AuctionItem = {
  _id: string;
  title: string;
  brand: string;
  carModel: string;
  year: number;
  images: string[];
  currentPrice: number;
  endTime: string;
  status: string;
};

export default function HomeClient({
  featured,
  allActive,
  latest,
}: {
  featured: AuctionItem[];
  allActive: AuctionItem[];
  latest: AuctionItem[];
}) {
  const latestAuctions = latest.length > 0 ? latest.slice(0, 8) : allActive.slice(0, 8);
  const featuredBanner = featured[0] ?? allActive[0] ?? null;
  const upcomingAuctions = allActive.slice(0, 5);
  const popularAuctions = allActive.slice(0, 9);

  return (
    <div>
      <HeroSection />
      <MarqueeBanner />
      <CategorySection />
      <LatestAuction auctions={latestAuctions} />
      <FeaturedBanner auction={featuredBanner} />
      <UpcomingAuction auctions={upcomingAuctions} />
      <PopularAuction auctions={popularAuctions} />
      <WorkProcess />
      <FAQSection />
    </div>
  );
}
