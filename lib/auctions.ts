import Auction from "@/models/Auction";

/** Atomically flips an expired active auction to 'ended'. */
export async function autoCloseIfExpired(id: string) {
  const now = new Date();
  await Auction.findOneAndUpdate(
    { _id: id, status: "active", endTime: { $lt: now } },
    { $set: { status: "ended" } }
  );
}

export async function sweepExpiredAuctions() {
  const now = new Date();
  const res = await Auction.updateMany(
    { status: "active", endTime: { $lt: now } },
    { $set: { status: "ended" } }
  );
  return res.modifiedCount ?? 0;
}
