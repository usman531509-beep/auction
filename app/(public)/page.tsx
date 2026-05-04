import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await dbConnect();

  const baseFilter = { status: { $ne: "hidden" } };
  const [featured, latest] = await Promise.all([
    Car.find({ ...baseFilter, featured: true }).sort({ createdAt: -1 }).limit(8).lean(),
    Car.find(baseFilter).sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  const serialize = (c: any) => ({
    _id: String(c._id),
    title: c.title,
    brand: c.brand,
    year: c.year,
    images: c.images,
    price: c.price,
    status: c.status,
  });

  return <HomeClient featured={featured.map(serialize)} latest={latest.map(serialize)} />;
}
