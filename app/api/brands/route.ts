import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Brand from "@/models/Brand";
import Car from "@/models/Car";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  await dbConnect();
  const brands = await Brand.find().sort({ name: 1 }).lean();

  const counts = await Car.aggregate([
    { $match: { status: "available" } },
    { $group: { _id: "$brand", count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c._id] = c.count;

  const result = brands.map((b: any) => ({
    ...b,
    _id: String(b._id),
    itemCount: countMap[b.name] ?? 0,
  }));

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();

  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  const existing = await Brand.findOne({ name: { $regex: new RegExp(`^${body.name.trim()}$`, "i") } });
  if (existing) {
    return NextResponse.json({ error: "Brand already exists" }, { status: 409 });
  }

  const doc = await Brand.create({
    name: body.name.trim(),
    logo: body.logo?.trim() ?? "",
  });

  return NextResponse.json(doc, { status: 201 });
}
