import Link from "next/link";
import { PlusCircle, Car as CarIcon, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Car from "@/models/Car";
import Order from "@/models/Order";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await dbConnect();
  const [users, available, sold, orders, recent] = await Promise.all([
    User.countDocuments(),
    Car.countDocuments({ status: "available" }),
    Car.countDocuments({ status: "sold" }),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-ink-muted">Snapshot of your inventory and orders.</p>
        </div>
        <Button asChild>
          <Link href="/admin/cars/new"><PlusCircle className="h-4 w-4" /> New car</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Users} label="Users" value={users} />
        <Stat icon={CarIcon} label="Available cars" value={available} />
        <Stat icon={TrendingUp} label="Sold cars" value={sold} />
        <Stat icon={ShoppingBag} label="Total orders" value={orders} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>Latest orders placed by customers.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {recent.length === 0 ? (
            <p className="text-sm text-ink-muted">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((o: any) => (
                <li key={String(o._id)} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{o.name} <span className="text-ink-muted text-xs">({o.email})</span></div>
                    <div className="text-xs text-ink-muted">{o.items.length} item(s) · {o.status}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(o.total)}</div>
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
