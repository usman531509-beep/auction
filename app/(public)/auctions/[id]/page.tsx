import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { autoCloseIfExpired } from "@/lib/auctions";
import CountdownTimer from "@/components/auctions/CountdownTimer";
import BidPanel from "@/components/auctions/BidPanel";
import SafeImage from "@/components/ui/safe-image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AuctionDetailPage({ params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await dbConnect();
  await autoCloseIfExpired(params.id);
  const auction = await Auction.findById(params.id).lean();
  if (!auction) notFound();
  const a: any = auction;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9] bg-surface">
            <SafeImage
              src={a.images?.[0] ?? `https://picsum.photos/seed/${a._id}/1200/700`}
              alt={a.title}
              fill
              sizes="(max-width:1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>
          {a.images?.length > 1 && (
            <div className="p-3 grid grid-cols-4 gap-2">
              {a.images.slice(1, 5).map((u: string, i: number) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
              <span>{a.brand}</span>
              <span>·</span>
              <span>{a.carModel}</span>
              <span>·</span>
              <span>{a.year}</span>
            </div>
            <h1 className="text-2xl font-semibold text-ink mt-1">{a.title}</h1>
            <p className="text-ink-soft mt-3 whitespace-pre-line">{a.description || "No description."}</p>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-ink-muted">Current bid</span>
              <CountdownTimer endTime={a.endTime} />
            </div>
            <div className="mt-1 text-3xl font-semibold text-ink">{formatPrice(a.currentPrice)}</div>
            <div className="mt-1 text-xs text-ink-muted">Starting price {formatPrice(a.startingPrice)}</div>
            <div className="mt-4 border-t border-border pt-4">
              <BidPanel auctionId={String(a._id)} endTime={a.endTime.toISOString()} initialPrice={a.currentPrice} status={a.status} />
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
