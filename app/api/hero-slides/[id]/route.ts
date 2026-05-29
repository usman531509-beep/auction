import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";
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
  const update: Record<string, any> = {};
  if (typeof body?.image === "string") update.image = body.image;
  if (typeof body?.caption === "string") update.caption = body.caption;
  if (typeof body?.active === "boolean") update.active = body.active;
  if (typeof body?.order === "number") update.order = body.order;

  const doc = await HeroSlide.findByIdAndUpdate(params.id, update, { new: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const deleted = await HeroSlide.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
