import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const session = await auth();
  await dbConnect();
  const orders = await Order.find({
    $or: [{ userId: session!.user.id }, { email: session!.user.email }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My orders</h1>
        <p className="text-sm text-ink-muted">Every order you've placed.</p>
      </div>

      {orders.length === 0 ? (
        <Card><div className="p-10 text-center text-ink-muted">No orders yet.</div></Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => (
            <Card key={String(o._id)}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-ink-muted">Order #{String(o._id).slice(-8)}</div>
                    <div className="text-sm text-ink-soft">
                      Placed {format(new Date(o.createdAt), "yyyy-MM-dd HH:mm")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        o.status === "completed" ? "default" :
                        o.status === "cancelled" ? "destructive" : "secondary"
                      }
                    >
                      {o.status}
                    </Badge>
                    <span className="font-semibold text-ink">{formatPrice(o.total)}</span>
                  </div>
                </div>
                <ul className="border-t border-border pt-3 text-sm space-y-1">
                  {o.items.map((it: any, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span className="text-ink-soft">
                        {it.title} <span className="text-ink-muted">× {it.quantity}</span>
                      </span>
                      <span className="text-ink">{formatPrice(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                {o.address && (
                  <div className="text-xs text-ink-muted">Delivery: {o.address}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
