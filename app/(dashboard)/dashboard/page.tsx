import Link from "next/link";
import { ShoppingBag, CheckCircle, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  const userFilter = {
    $or: [{ userId: session!.user.id }, { email: session!.user.email }],
  };
  const [total, pending, completed, recent] = await Promise.all([
    Order.countDocuments(userFilter),
    Order.countDocuments({ ...userFilter, status: { $in: ["pending", "confirmed", "shipped"] } }),
    Order.countDocuments({ ...userFilter, status: "completed" }),
    Order.find(userFilter).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {session!.user.name}</h1>
        <p className="text-sm text-ink-muted">Here's a summary of your orders.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat icon={ShoppingBag} label="Total orders" value={total} />
        <Stat icon={Clock} label="In progress" value={pending} />
        <Stat icon={CheckCircle} label="Completed" value={completed} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Your last five orders.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {recent.length === 0 ? (
            <p className="text-sm text-ink-muted">No orders yet. <Link href="/cars" className="text-accent">Browse cars →</Link></p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((o: any) => (
                <li key={String(o._id)} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{o.items.length} item(s)</div>
                    <div className="text-xs text-ink-muted">{formatPrice(o.total)}</div>
                  </div>
                  <Badge variant={o.status === "completed" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"}>
                    {o.status}
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
