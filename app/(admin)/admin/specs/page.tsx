import { dbConnect } from "@/lib/db";
import Spec from "@/models/Spec";
import SpecList from "@/components/admin/SpecList";

export const dynamic = "force-dynamic";

export default async function AdminSpecsPage() {
  await dbConnect();
  const docs = await Spec.find().sort({ category: 1, name: 1 }).lean();

  const specs = docs.map((s: any) => ({
    _id: String(s._id),
    name: s.name,
    category: s.category ?? "",
    description: s.description ?? "",
  }));

  const categories = Array.from(
    new Set(specs.map((s) => s.category).filter(Boolean))
  ).sort() as string[];

  return <SpecList specs={specs} categories={categories} />;
}
