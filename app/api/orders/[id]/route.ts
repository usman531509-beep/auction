import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { orderStatusSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

function badId() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await Order.findByIdAndUpdate(params.id, { status: parsed.data.status }, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const deleted = await Order.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
