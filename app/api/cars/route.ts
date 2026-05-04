import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import { carSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const q = searchParams.get("q");
  const status = searchParams.get("status");
  const minPrice = Number(searchParams.get("minPrice") ?? 0) || 0;
  const maxPrice = Number(searchParams.get("maxPrice") ?? 0) || 0;
  const limit = Math.min(Number(searchParams.get("limit") ?? 24), 60);

  const filter: Record<string, any> = {};
  if (brand) filter.brand = new RegExp(`^${brand}$`, "i");
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { brand: new RegExp(q, "i") },
      { carModel: new RegExp(q, "i") },
    ];
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  const cars = await Car.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  const brands = await Car.distinct("brand");
  return NextResponse.json({ cars, brands });
}

export async function POST(req: Request) {
  const { error, session } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = carSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const doc = await Car.create({ ...parsed.data, createdBy: session!.user.id });
  return NextResponse.json(doc, { status: 201 });
}
