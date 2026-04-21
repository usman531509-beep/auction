import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { sweepExpiredAuctions } from "@/lib/auctions";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await dbConnect();
  await sweepExpiredAuctions();

  const [featured, allActive, latest] = await Promise.all([
    Auction.find({ featured: true, status: "active" })
      .sort({ endTime: 1 })
      .limit(12)
      .lean(),
    Auction.find({ status: "active" })
      .sort({ currentPrice: -1 })
      .limit(20)
      .lean(),
    Auction.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
  ]);

  const serialize = (a: any) => ({
    _id: String(a._id),
    title: a.title,
    brand: a.brand,
    carModel: a.carModel,
    year: a.year,
    images: a.images,
    currentPrice: a.currentPrice,
    endTime: a.endTime.toISOString(),
    status: a.status,
  });

  return (
    <HomeClient
      featured={featured.map(serialize)}
      allActive={allActive.map(serialize)}
      latest={latest.map(serialize)}
    />
  );
}
