import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Bid from "@/models/Bid";
import Auction from "@/models/Auction";
import { requireUser } from "@/lib/authz";

export async function GET() {
  const { error, session } = await requireUser();
  if (error) return error;
  await dbConnect();
  const bids = await Bid.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate({ path: "auctionId", model: Auction, select: "title brand currentPrice status endTime" })
    .lean();
  return NextResponse.json({ bids });
}
