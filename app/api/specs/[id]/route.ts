import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Spec from "@/models/Spec";
import Car from "@/models/Car";
import { specSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

function badId() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = specSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const update: Record<string, any> = {};
  if (typeof parsed.data.name === "string") update.name = parsed.data.name.trim();
  if (typeof parsed.data.category === "string") update.category = parsed.data.category.trim();
  if (typeof parsed.data.description === "string") update.description = parsed.data.description.trim();

  const updated = await Spec.findByIdAndUpdate(params.id, update, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const deleted = await Spec.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await Car.updateMany({ specs: params.id }, { $pull: { specs: params.id } });
  return NextResponse.json({ ok: true });
}
