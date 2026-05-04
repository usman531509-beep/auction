import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import CarForm from "@/components/admin/CarForm";

export const dynamic = "force-dynamic";

export default async function EditCarPage({ params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await dbConnect();
  const c = await Car.findById(params.id).lean();
  if (!c) notFound();
  const car = JSON.parse(JSON.stringify(c));
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit car</h1>
        <p className="text-sm text-ink-muted">Changes appear on the public store immediately.</p>
      </div>
      <CarForm car={car} />
    </div>
  );
}
