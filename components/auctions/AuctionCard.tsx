import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import SafeImage from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type Props = {
  auction: {
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
};

export default function AuctionCard({ auction }: Props) {
  const img = auction.images[0] ?? `https://picsum.photos/seed/${auction._id}/600/400`;
  const ended = auction.status !== "active";
  return (
    <Link href={`/auctions/${auction._id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lift transition-shadow">
        <div className="relative aspect-[5/3] bg-surface overflow-hidden">
          <SafeImage
            src={img}
            alt={auction.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform"
          />
          <div className="absolute top-2 left-2">
            <Badge variant={ended ? "secondary" : "default"}>{ended ? "Ended" : "Live"}</Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-ink-muted">{auction.brand} · {auction.year}</span>
            <CountdownTimer endTime={auction.endTime} />
          </div>
          <h3 className="font-medium text-ink line-clamp-1">{auction.title}</h3>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-ink-muted">Current bid</span>
            <span className="text-lg font-semibold text-ink">{formatPrice(auction.currentPrice)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
