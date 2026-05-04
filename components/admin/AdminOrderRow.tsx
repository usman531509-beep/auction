"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statuses = ["pending", "confirmed", "shipped", "completed", "cancelled"] as const;

const selectClass =
  "h-8 rounded-md border border-border bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30";

type Props = {
  order: {
    _id: string;
    name: string;
    email: string;
    contact: string;
    items: { title: string; quantity: number; price: number }[];
    total: string;
    status: string;
    createdAt: string;
  };
};

export default function AdminOrderRow({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [open, setOpen] = useState(false);

  async function changeStatus(next: string) {
    setStatus(next);
    const res = await fetch(`/api/orders/${order._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setStatus(order.status);
      toast.error("Failed to update");
      return;
    }
    toast.success(`Status: ${next}`);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete order from ${order.email}?`)) return;
    const res = await fetch(`/api/orders/${order._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed");
    toast.success("Order deleted");
    router.refresh();
  }

  const variant =
    status === "completed" ? "default" : status === "cancelled" ? "destructive" : "secondary";

  return (
    <>
      <TableRow>
        <TableCell>
          <button onClick={() => setOpen(!open)} className="font-medium text-ink hover:text-accent text-left">
            {order.name}
          </button>
          <div className="text-xs text-ink-muted">{order.email}</div>
        </TableCell>
        <TableCell className="text-ink-soft text-xs">{order.contact}</TableCell>
        <TableCell className="text-xs text-ink-muted">{order.items.length} item(s)</TableCell>
        <TableCell className="font-medium">{order.total}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge variant={variant as any}>{status}</Badge>
            <select className={selectClass} value={status} onChange={(e) => changeStatus(e.target.value)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </TableCell>
        <TableCell className="text-ink-muted text-xs">{order.createdAt}</TableCell>
        <TableCell className="text-right">
          <Button variant="outline" size="sm" onClick={remove} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </TableCell>
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={7} className="bg-surface">
            <ul className="text-xs space-y-1 py-2">
              {order.items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>{it.title} <span className="text-ink-muted">× {it.quantity}</span></span>
                  <span>¥{(it.price * it.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
