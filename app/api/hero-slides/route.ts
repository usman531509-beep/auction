import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";
import { requireAdmin } from "@/lib/authz";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  const query = all ? {} : { active: true };
  const slides = await HeroSlide.find(query).sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json(
    slides.map((s: any) => ({
      _id: String(s._id),
      image: s.image,
      caption: s.caption ?? "",
      order: s.order ?? 0,
      active: s.active !== false,
    }))
  );
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const body = await req.json().catch(() => null);
  if (!body?.image || typeof body.image !== "string") {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }
  const last = await HeroSlide.findOne().sort({ order: -1 }).lean();
  const nextOrder = ((last as any)?.order ?? -1) + 1;
  const doc = await HeroSlide.create({
    image: body.image,
    caption: typeof body.caption === "string" ? body.caption : "",
    order: nextOrder,
    active: body.active === false ? false : true,
  });
  return NextResponse.json(doc, { status: 201 });
}
