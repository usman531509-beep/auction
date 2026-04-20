import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Brand from "@/models/Brand";
import { requireAdmin } from "@/lib/authz";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();

  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  const brand = await Brand.findByIdAndUpdate(
    params.id,
    { name: body.name.trim(), logo: body.logo?.trim() ?? "" },
    { new: true }
  );

  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  return NextResponse.json(brand);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();

  const brand = await Brand.findByIdAndDelete(params.id);
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
