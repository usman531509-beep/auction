import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/authz";
import { z } from "zod";

const patchSchema = z.object({ role: z.enum(["user", "admin"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  await dbConnect();
  const updated = await User.findByIdAndUpdate(params.id, { role: parsed.data.role }, { new: true }).select("name email role");
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (session!.user.id === params.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }
  await dbConnect();
  const r = await User.findByIdAndDelete(params.id);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
