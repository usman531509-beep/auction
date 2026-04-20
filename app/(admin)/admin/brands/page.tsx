import { dbConnect } from "@/lib/db";
import Brand from "@/models/Brand";
import Auction from "@/models/Auction";
import BrandList from "@/components/admin/BrandList";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  await dbConnect();
  const brands = await Brand.find().sort({ name: 1 }).lean();

  const counts = await Auction.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: "$brand", count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c._id] = c.count;

  const serialized = brands.map((b: any) => ({
    _id: String(b._id),
    name: b.name,
    logo: b.logo ?? "",
    itemCount: countMap[b.name] ?? 0,
  }));

  return <BrandList brands={serialized} />;
}
