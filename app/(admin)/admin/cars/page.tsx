import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import AdminCarRow from "@/components/admin/AdminCarRow";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  await dbConnect();
  const cars = await Car.find().sort({ createdAt: -1 }).lean();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cars</h1>
          <p className="text-sm text-ink-muted">Add, edit and remove cars from your inventory.</p>
        </div>
        <Button asChild>
          <Link href="/admin/cars/new"><PlusCircle className="h-4 w-4" /> New car</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((c: any) => (
              <AdminCarRow
                key={String(c._id)}
                car={{
                  _id: String(c._id),
                  title: c.title,
                  brand: c.brand,
                  priceLabel: formatPrice(c.price),
                  status: c.status,
                  featured: Boolean(c.featured),
                  stock: c.stock ?? 0,
                }}
              />
            ))}
            {cars.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-ink-muted">No cars yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
