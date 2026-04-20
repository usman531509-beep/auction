import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import AuctionForm from "@/components/admin/AuctionForm";

export const dynamic = "force-dynamic";

export default async function EditAuctionPage({ params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await dbConnect();
  const a = await Auction.findById(params.id).lean();
  if (!a) notFound();
  const auction = JSON.parse(JSON.stringify(a));
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit auction</h1>
        <p className="text-sm text-ink-muted">Changes reflect on the public site immediately.</p>
      </div>
      <AuctionForm auction={auction} />
    </div>
  );
}
