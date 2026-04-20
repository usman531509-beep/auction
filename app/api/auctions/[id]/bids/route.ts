import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import User from "@/models/User";
import { bidSchema } from "@/lib/validators";
import { requireUser } from "@/lib/authz";
import { autoCloseIfExpired } from "@/lib/auctions";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await dbConnect();
  await autoCloseIfExpired(params.id);
  const auction = await Auction.findById(params.id).lean();
  if (!auction) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const bids = await Bid.find({ auctionId: params.id })
    .sort({ amount: -1, createdAt: -1 })
    .limit(25)
    .populate({ path: "userId", select: "name", model: User })
    .lean();
  return NextResponse.json({ auction, bids });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser();
  if (error) return error;
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  const parsed = bidSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid bid" }, { status: 400 });
  }
  await dbConnect();
  const now = new Date();
  const amount = parsed.data.amount;

  const updated = await Auction.findOneAndUpdate(
    {
      _id: params.id,
      status: "active",
      startTime: { $lte: now },
      endTime: { $gt: now },
      currentPrice: { $lt: amount },
    },
    { $set: { currentPrice: amount } },
    { new: true }
  );

  if (!updated) {
    const a = await Auction.findById(params.id).lean();
    if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (a.endTime && new Date(a.endTime) <= now) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 409 });
    }
    return NextResponse.json(
      { error: `Bid must be higher than current price` },
      { status: 409 }
    );
  }

  await Bid.create({
    auctionId: params.id,
    userId: session!.user.id,
    amount,
  });

  return NextResponse.json({ ok: true, currentPrice: updated.currentPrice }, { status: 201 });
}
