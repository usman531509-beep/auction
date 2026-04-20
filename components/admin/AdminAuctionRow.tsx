"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TableRow, TableCell } from "@/components/ui/table";

type Props = {
  auction: {
    _id: string;
    title: string;
    brand: string;
    currentPrice: number;
    priceLabel: string;
    status: string;
    featured: boolean;
    endsLabel: string;
  };
};

export default function AdminAuctionRow({ auction }: Props) {
  const router = useRouter();
  const [featured, setFeatured] = useState(auction.featured);
  const [pending, startTransition] = useTransition();

  async function remove() {
    if (!confirm("Cancel this auction? This hides it from bidders.")) return;
    const res = await fetch(`/api/auctions/${auction._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Auction cancelled");
    router.refresh();
  }

  async function toggleFeatured(next: boolean) {
    setFeatured(next);
    const res = await fetch(`/api/auctions/${auction._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: next }),
    });
    if (!res.ok) {
      setFeatured(!next);
      toast.error("Failed to update");
      return;
    }
    toast.success(next ? "Added to featured" : "Removed from featured");
    startTransition(() => router.refresh());
  }

  const statusVariant = auction.status === "active" ? "default" : auction.status === "ended" ? "secondary" : "destructive";

  return (
    <TableRow>
      <TableCell>
        <Link href={`/auctions/${auction._id}`} className="font-medium text-ink hover:text-accent">
          {auction.title}
        </Link>
      </TableCell>
      <TableCell className="text-ink-soft">{auction.brand}</TableCell>
      <TableCell className="font-medium">{auction.priceLabel}</TableCell>
      <TableCell>
        <Badge variant={statusVariant as any}>{auction.status}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={featured}
            onCheckedChange={toggleFeatured}
            disabled={pending}
            aria-label="Feature on home"
          />
          <span className="text-xs text-ink-muted">{featured ? "On" : "Off"}</span>
        </div>
      </TableCell>
      <TableCell className="text-ink-muted text-xs">{auction.endsLabel}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/auctions/${auction._id}/edit`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={remove} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
