import { Suspense } from "react";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import CarCard from "@/components/cars/CarCard";
import CarFilters from "@/components/cars/CarFilters";

export const dynamic = "force-dynamic";

type SP = { q?: string; brand?: string; year?: string; maxPrice?: string };

export default async function CarsPage({ searchParams }: { searchParams: SP }) {
  await dbConnect();

  const filter: Record<string, any> = { status: { $ne: "hidden" } };
  if (searchParams.brand) filter.brand = new RegExp(`^${searchParams.brand}$`, "i");
  if (searchParams.year) filter.year = Number(searchParams.year);
  if (searchParams.q) {
    filter.$or = [
      { title: new RegExp(searchParams.q, "i") },
      { brand: new RegExp(searchParams.q, "i") },
      { carModel: new RegExp(searchParams.q, "i") },
    ];
  }
  const max = Number(searchParams.maxPrice) || 0;
  if (max) filter.price = { $lte: max };

  const [cars, brands] = await Promise.all([
    Car.find(filter).sort({ createdAt: -1 }).limit(48).lean(),
    Car.distinct("brand"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Cars</h1>
        <p className="text-sm text-ink-muted">Browse and order our latest stock.</p>
      </div>
      <div className="mb-6">
        <Suspense fallback={null}>
          <CarFilters brands={brands as string[]} />
        </Suspense>
      </div>
      {cars.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">No cars match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((c: any) => (
            <CarCard key={String(c._id)} car={{ ...c, _id: String(c._id) }} />
          ))}
        </div>
      )}
    </div>
  );
}
