import Link from "next/link";
import { PlusCircle, Gavel, Users, Receipt, TrendingUp } from "lucide-react";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await dbConnect();
  const [users, active, ended, bids, recent] = await Promise.all([
    User.countDocuments(),
    Auction.countDocuments({ status: "active" }),
    Auction.countDocuments({ status: "ended" }),
    Bid.countDocuments(),
    Auction.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-ink-muted">Snapshot of your auctions, users, and bids.</p>
        </div>
        <Button asChild>
          <Link href="/admin/auctions/new"><PlusCircle className="h-4 w-4" /> New auction</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Users} label="Users" value={users} />
        <Stat icon={Gavel} label="Active auctions" value={active} />
        <Stat icon={TrendingUp} label="Ended auctions" value={ended} />
        <Stat icon={Receipt} label="Total bids" value={bids} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent auctions</CardTitle>
          <CardDescription>Latest auctions you've created.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {recent.length === 0 ? (
            <p className="text-sm text-ink-muted">No auctions yet. <Link href="/admin/auctions/new" className="text-accent">Create one →</Link></p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((a: any) => (
                <li key={String(a._id)} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-ink-muted">{a.brand} · {a.year}</div>
                  </div>
                  <Link href={`/admin/auctions/${a._id}/edit`} className="text-xs text-accent hover:underline">Edit</Link>
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
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
