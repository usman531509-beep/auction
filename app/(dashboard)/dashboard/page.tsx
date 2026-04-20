import Link from "next/link";
import mongoose from "mongoose";
import { Receipt, Trophy, Gavel } from "lucide-react";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Bid from "@/models/Bid";
import Auction from "@/models/Auction";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  const userId = session!.user.id;
  const [bidCount, activeBids, recent] = await Promise.all([
    Bid.countDocuments({ userId }),
    Bid.distinct("auctionId", { userId }).then((ids) =>
      Auction.countDocuments({ _id: { $in: ids }, status: "active" })
    ),
    Bid.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "auctionId", model: Auction, select: "title status currentPrice" })
      .lean(),
  ]);

  const wins = await Bid.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $lookup: { from: "auctions", localField: "auctionId", foreignField: "_id", as: "a" } },
    { $unwind: "$a" },
    { $match: { $expr: { $and: [{ $eq: ["$a.status", "ended"] }, { $eq: ["$amount", "$a.currentPrice"] }] } } },
    { $count: "n" },
  ]);
  const winCount = wins[0]?.n ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {session!.user.name}</h1>
        <p className="text-sm text-ink-muted">Here's a summary of your bidding activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat icon={Receipt} label="Total bids" value={bidCount} />
        <Stat icon={Gavel} label="Active auctions" value={activeBids} />
        <Stat icon={Trophy} label="Won auctions" value={winCount} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Your last five bids.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bids">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {recent.length === 0 ? (
            <p className="text-sm text-ink-muted">No bids yet. <Link href="/auctions" className="text-accent">Browse auctions →</Link></p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((b: any) => (
                <li key={String(b._id)} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <Link href={`/auctions/${b.auctionId?._id}`} className="font-medium hover:text-accent">
                      {b.auctionId?.title ?? "Auction"}
                    </Link>
                    <div className="text-xs text-ink-muted">Your bid: {formatPrice(b.amount)}</div>
                  </div>
                  <Badge variant={b.auctionId?.status === "active" ? "default" : "secondary"}>
                    {b.auctionId?.status ?? "—"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
