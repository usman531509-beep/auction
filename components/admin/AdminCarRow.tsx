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
  car: {
    _id: string;
    title: string;
    brand: string;
    priceLabel: string;
    status: string;
    featured: boolean;
    stock: number;
  };
};

export default function AdminCarRow({ car }: Props) {
  const router = useRouter();
  const [featured, setFeatured] = useState(car.featured);
  const [pending, startTransition] = useTransition();

  async function remove() {
    if (!confirm("Delete this car? This cannot be undone.")) return;
    const res = await fetch(`/api/cars/${car._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Car deleted");
    router.refresh();
  }

  async function toggleFeatured(next: boolean) {
    setFeatured(next);
    const res = await fetch(`/api/cars/${car._id}`, {
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

  const variant =
    car.status === "available" ? "default" : car.status === "sold" ? "secondary" : "destructive";

  return (
    <TableRow>
      <TableCell>
        <Link href={`/cars/${car._id}`} className="font-medium text-ink hover:text-accent">
          {car.title}
        </Link>
      </TableCell>
      <TableCell className="text-ink-soft">{car.brand}</TableCell>
      <TableCell className="font-medium">{car.priceLabel}</TableCell>
      <TableCell><Badge variant={variant as any}>{car.status}</Badge></TableCell>
      <TableCell className="text-ink-soft">{car.stock}</TableCell>
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
      <TableCell className="text-right space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/cars/${car._id}/edit`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={remove} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
