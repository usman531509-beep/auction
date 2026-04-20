import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import AdminAuctionRow from "@/components/admin/AdminAuctionRow";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAuctionsPage() {
  await dbConnect();
  const auctions = await Auction.find().sort({ createdAt: -1 }).lean();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Auctions</h1>
          <p className="text-sm text-ink-muted">
            Create, edit and cancel auctions. Toggle the switch to feature an auction on the home page.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/auctions/new"><PlusCircle className="h-4 w-4" /> New auction</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Ends</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions.map((a: any) => (
              <AdminAuctionRow
                key={String(a._id)}
                auction={{
                  _id: String(a._id),
                  title: a.title,
                  brand: a.brand,
                  currentPrice: a.currentPrice,
                  status: a.status,
                  featured: Boolean(a.featured),
                  endsLabel: format(new Date(a.endTime), "yyyy-MM-dd HH:mm"),
                  priceLabel: formatPrice(a.currentPrice),
                }}
              />
            ))}
            {auctions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-ink-muted">No auctions yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
