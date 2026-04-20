import { Suspense } from "react";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { sweepExpiredAuctions } from "@/lib/auctions";
import AuctionCard from "@/components/auctions/AuctionCard";
import AuctionFilters from "@/components/auctions/AuctionFilters";

export const dynamic = "force-dynamic";

type SP = { q?: string; brand?: string; model?: string; year?: string; minPrice?: string; maxPrice?: string };

export default async function AuctionsPage({ searchParams }: { searchParams: SP }) {
  await dbConnect();
  await sweepExpiredAuctions();

  const filter: Record<string, any> = {};
  if (searchParams.brand) filter.brand = new RegExp(`^${searchParams.brand}$`, "i");
  if (searchParams.model) filter.carModel = new RegExp(`^${searchParams.model}$`, "i");
  if (searchParams.year) filter.year = Number(searchParams.year);
  if (searchParams.q) {
    filter.$or = [
      { title: new RegExp(searchParams.q, "i") },
      { brand: new RegExp(searchParams.q, "i") },
      { carModel: new RegExp(searchParams.q, "i") },
    ];
  }
  const min = Number(searchParams.minPrice) || 0;
  const max = Number(searchParams.maxPrice) || 0;
  if (min || max) {
    filter.currentPrice = {};
    if (min) filter.currentPrice.$gte = min;
    if (max) filter.currentPrice.$lte = max;
  }

  const [auctions, brands] = await Promise.all([
    Auction.find(filter).sort({ createdAt: -1 }).limit(48).lean(),
    Auction.distinct("brand"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Auctions</h1>
        <p className="text-sm text-ink-muted">Find your next ride.</p>
      </div>
      <div className="mb-6">
        <Suspense fallback={null}>
          <AuctionFilters brands={brands as string[]} />
        </Suspense>
      </div>
      {auctions.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">No auctions match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((a: any) => (
            <AuctionCard
              key={String(a._id)}
              auction={{ ...a, _id: String(a._id), endTime: a.endTime.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
