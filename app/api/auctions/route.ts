import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { auctionSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";
import { sweepExpiredAuctions } from "@/lib/auctions";

export async function GET(req: Request) {
  await dbConnect();
  await sweepExpiredAuctions();
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const q = searchParams.get("q");
  const minPrice = Number(searchParams.get("minPrice") ?? 0) || 0;
  const maxPrice = Number(searchParams.get("maxPrice") ?? 0) || 0;
  const status = searchParams.get("status");
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
    filter.currentPrice = {};
    if (minPrice) filter.currentPrice.$gte = minPrice;
    if (maxPrice) filter.currentPrice.$lte = maxPrice;
  }

  const auctions = await Auction.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  const brands = await Auction.distinct("brand");
  return NextResponse.json({ auctions, brands });
}

export async function POST(req: Request) {
  const { error, session } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = auctionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.endTime <= parsed.data.startTime) {
    return NextResponse.json({ error: "endTime must be after startTime" }, { status: 400 });
  }
  const doc = await Auction.create({
    ...parsed.data,
    currentPrice: parsed.data.startingPrice,
    createdBy: session!.user.id,
  });
  return NextResponse.json(doc, { status: 201 });
}
