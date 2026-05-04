import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import { carSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

function badId() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const car = await Car.findById(params.id).lean();
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = carSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await Car.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const deleted = await Car.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
