import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Spec from "@/models/Spec";
import { specSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  await dbConnect();
  const specs = await Spec.find().sort({ category: 1, name: 1 }).lean();
  return NextResponse.json(
    specs.map((s: any) => ({
      _id: String(s._id),
      name: s.name,
      category: s.category ?? "",
      description: s.description ?? "",
    }))
  );
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = specSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const existing = await Spec.findOne({
    name: { $regex: new RegExp(`^${parsed.data.name.trim()}$`, "i") },
  });
  if (existing) {
    return NextResponse.json({ error: "Specification already exists" }, { status: 409 });
  }
  const doc = await Spec.create({
    name: parsed.data.name.trim(),
    category: parsed.data.category?.trim() ?? "",
    description: parsed.data.description?.trim() ?? "",
  });
  return NextResponse.json(doc, { status: 201 });
}
