import { dbConnect } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";
import CarouselManager from "@/components/admin/CarouselManager";

export const dynamic = "force-dynamic";

export default async function AdminCarouselPage() {
  await dbConnect();
  const docs = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
  const slides = docs.map((s: any) => ({
    _id: String(s._id),
    image: s.image,
    caption: s.caption ?? "",
    order: s.order ?? 0,
    active: s.active !== false,
  }));
  return <CarouselManager slides={slides} />;
}
