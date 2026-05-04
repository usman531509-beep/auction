import { format } from "date-fns";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import AdminOrderRow from "@/components/admin/AdminOrderRow";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(500).lean();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-ink-muted">All customer orders. Update statuses as you process them.</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o: any) => (
              <AdminOrderRow
                key={String(o._id)}
                order={{
                  _id: String(o._id),
                  name: o.name,
                  email: o.email,
                  contact: o.contact,
                  items: o.items,
                  total: formatPrice(o.total),
                  status: o.status,
                  createdAt: format(new Date(o.createdAt), "yyyy-MM-dd HH:mm"),
                }}
              />
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-ink-muted">No orders yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
