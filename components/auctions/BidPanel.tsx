"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Gavel } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type Props = {
  auctionId: string;
  endTime: string;
  initialPrice: number;
  status: string;
};

export default function BidPanel({ auctionId, endTime, initialPrice, status }: Props) {
  const { data: session } = useSession();
  const { data, mutate } = useSWR<{ auction: any; bids: any[] }>(
    `/api/auctions/${auctionId}/bids`,
    { refreshInterval: 3000, fallbackData: { auction: { currentPrice: initialPrice, status }, bids: [] } }
  );
  const currentPrice = data?.auction?.currentPrice ?? initialPrice;
  const liveStatus = data?.auction?.status ?? status;
  const ended = liveStatus !== "active" || new Date(endTime).getTime() <= Date.now();

  const [amount, setAmount] = useState<number>(currentPrice + 100);
  const [loading, setLoading] = useState(false);

  async function placeBid(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    const res = await fetch(`/api/auctions/${auctionId}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      toast.error(json.error || "Bid failed");
      mutate();
      return;
    }
    toast.success(`Bid placed at ${formatPrice(amount)}`);
    setAmount(amount + 100);
    mutate();
  }

  if (ended) {
    const winner = data?.bids?.[0];
    return (
      <div className="space-y-3">
        <Badge variant="secondary">Auction ended</Badge>
        {winner && (
          <div className="text-sm text-ink-soft">
            Winning bid: <span className="font-semibold text-ink">{formatPrice(winner.amount)}</span>
            {winner.userId?.name && <> by {winner.userId.name}</>}
          </div>
        )}
        <BidList bids={data?.bids ?? []} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-soft">Log in to place a bid.</p>
        <Button asChild className="w-full">
          <Link href={`/login?callbackUrl=/auctions/${auctionId}`}>Log in to bid</Link>
        </Button>
        <BidList bids={data?.bids ?? []} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={placeBid} className="space-y-3">
        <div className="space-y-1.5">
          <Label>Your bid (min {formatPrice(currentPrice + 1)})</Label>
          <Input
            type="number"
            min={currentPrice + 1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <Button disabled={loading || amount <= currentPrice} className="w-full">
          <Gavel className="h-4 w-4" />
          {loading ? "Placing bid..." : `Place bid — ${formatPrice(amount)}`}
        </Button>
      </form>
      <BidList bids={data?.bids ?? []} />
    </div>
  );
}

function BidList({ bids }: { bids: any[] }) {
  if (!bids?.length) {
    return <p className="text-xs text-ink-muted pt-3 border-t border-border">No bids yet.</p>;
  }
  return (
    <div className="pt-4 border-t border-border">
      <div className="text-xs font-medium text-ink-soft mb-2">Recent bids</div>
      <ul className="space-y-1.5 max-h-56 overflow-y-auto">
        {bids.map((b: any) => (
          <li key={b._id} className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">{b.userId?.name ?? "User"}</span>
            <span className="font-medium text-ink">{formatPrice(b.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
