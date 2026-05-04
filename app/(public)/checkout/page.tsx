"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/CartProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName((n) => n || session.user.name || "");
      setEmail((e) => e || session.user.email || "");
    }
  }, [session]);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        contact,
        address,
        notes,
        items: items.map((i) => ({ carId: i.carId, quantity: i.quantity })),
      }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      toast.error(json.error || "Failed to place order");
      return;
    }
    toast.success("Order placed!");
    clear();
    router.push(session?.user ? "/dashboard/orders" : "/");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-28 pb-12 text-center">
        <h1 className="text-2xl font-semibold text-ink mb-2">Checkout</h1>
        <p className="text-ink-muted mb-4">Your cart is empty.</p>
        <Button asChild>
          <Link href="/cars">Browse cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Checkout</h1>
        <p className="text-sm text-ink-muted">Provide your contact details to place the order.</p>
      </div>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardDescription>We'll use this to confirm your order.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone / contact</Label>
              <Input required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+81 ..." />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Address (optional)</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              {items.map((it) => (
                <li key={it.carId} className="flex justify-between gap-3">
                  <span className="truncate text-ink-soft">
                    {it.title} <span className="text-ink-muted">× {it.quantity}</span>
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-base font-semibold pt-3 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Placing order..." : "Place order"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
