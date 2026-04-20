import Link from "next/link";
import { format } from "date-fns";
import { dbConnect } from "@/lib/db";
import Bid from "@/models/Bid";
import User from "@/models/User";
import Auction from "@/models/Auction";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminBidsPage() {
  await dbConnect();
  const bids = await Bid.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({ path: "userId", model: User, select: "name email" })
    .populate({ path: "auctionId", model: Auction, select: "title" })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recent bids</h1>
        <p className="text-sm text-ink-muted">Last 200 bids across all auctions.</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auction</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map((b: any) => (
              <TableRow key={String(b._id)}>
                <TableCell>
                  {b.auctionId ? (
                    <Link href={`/auctions/${b.auctionId._id}`} className="text-accent hover:underline">
                      {b.auctionId.title}
                    </Link>
                  ) : "—"}
                </TableCell>
                <TableCell className="text-ink-soft">
                  {b.userId?.name} <span className="text-ink-muted text-xs">({b.userId?.email})</span>
                </TableCell>
                <TableCell className="font-medium">{formatPrice(b.amount)}</TableCell>
                <TableCell className="text-ink-muted text-xs">{format(new Date(b.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
              </TableRow>
            ))}
            {bids.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-10 text-ink-muted">No bids yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
