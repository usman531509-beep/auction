import Link from "next/link";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Bid from "@/models/Bid";
import Auction from "@/models/Auction";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BidsHistoryPage() {
  const session = await auth();
  await dbConnect();
  const bids = await Bid.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .populate({ path: "auctionId", model: Auction, select: "title brand currentPrice status endTime" })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bid history</h1>
        <p className="text-sm text-ink-muted">Every bid you've placed.</p>
      </div>

      {bids.length === 0 ? (
        <Card><div className="p-10 text-center text-ink-muted">No bids yet.</div></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auction</TableHead>
                <TableHead>Your bid</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((b: any) => {
                const a = b.auctionId;
                const leading = a && b.amount === a.currentPrice;
                let badge: { label: string; variant: any };
                if (!a) badge = { label: "—", variant: "secondary" };
                else if (a.status === "ended" && leading) badge = { label: "Won", variant: "success" };
                else if (a.status === "active" && leading) badge = { label: "Leading", variant: "default" };
                else if (a.status === "ended") badge = { label: "Lost", variant: "secondary" };
                else badge = { label: "Outbid", variant: "secondary" };
                return (
                  <TableRow key={String(b._id)}>
                    <TableCell>
                      {a ? (
                        <Link href={`/auctions/${a._id}`} className="font-medium hover:text-accent">{a.title}</Link>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(b.amount)}</TableCell>
                    <TableCell className="text-ink-soft">{a ? formatPrice(a.currentPrice) : "—"}</TableCell>
                    <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                    <TableCell className="text-ink-muted text-xs">{format(new Date(b.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
