import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { auctionSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";
import { autoCloseIfExpired } from "@/lib/auctions";
import mongoose from "mongoose";

function badId() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  await autoCloseIfExpired(params.id);
  const auction = await Auction.findById(params.id).lean();
  if (!auction) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(auction);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const body = await req.json().catch(() => null);
  const parsed = auctionSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await Auction.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) return badId();
  await dbConnect();
  const deleted = await Auction.findByIdAndUpdate(
    params.id,
    { $set: { status: "cancelled" } },
    { new: true }
  );
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
