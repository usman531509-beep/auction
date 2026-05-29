import { notFound } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import Spec from "@/models/Spec";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/cars/AddToCartButton";
import CarGallery from "@/components/cars/CarGallery";
import { getServerT } from "@/lib/i18n-server";
import {
  Gauge,
  Cog,
  Fuel,
  Palette,
  Globe,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Truck,
  Award,
  Tag,
  Check,
  Car as CarIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await dbConnect();
  const car = await Car.findById(params.id)
    .populate({ path: "specs", model: Spec, select: "name category description" })
    .lean();
  if (!car) notFound();
  const c: any = car;
  const { t } = getServerT();

  const carSpecs: { _id: string; name: string; category: string; description?: string }[] =
    Array.isArray(c.specs)
      ? c.specs.map((s: any) => ({
          _id: String(s._id),
          name: s.name,
          category: s.category ?? "",
          description: s.description ?? "",
        }))
      : [];
  const featuresByCategory = carSpecs.reduce<Record<string, typeof carSpecs>>((acc, sp) => {
    const key = sp.category?.trim() || "Other";
    (acc[key] = acc[key] || []).push(sp);
    return acc;
  }, {});
  const featureCategoryOrder = Object.keys(featuresByCategory).sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b)
  );

  const statusLabel =
    c.status === "available" ? t("status.available") :
    c.status === "sold" ? t("status.sold") : t("status.hidden");
  const isAvailable = c.status === "available";

  const specs = [
    c.year ? { icon: Calendar, label: t("car.spec.year"), value: String(c.year) } : null,
    c.brand ? { icon: Tag, label: t("car.spec.brand"), value: c.brand } : null,
    c.carModel ? { icon: CarIcon, label: t("car.spec.model"), value: c.carModel } : null,
    c.mileage ? { icon: Gauge, label: t("car.spec.mileage"), value: `${c.mileage.toLocaleString()} ${t("car.km")}` } : null,
    c.transmission ? { icon: Cog, label: t("car.spec.transmission"), value: c.transmission } : null,
    c.fuel ? { icon: Fuel, label: t("car.spec.fuel"), value: c.fuel } : null,
    c.color ? { icon: Palette, label: t("car.spec.color"), value: c.color } : null,
    c.country ? { icon: Globe, label: t("car.spec.country"), value: c.country } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  const trustItems = [
    { icon: ShieldCheck, title: t("car.trust.warranty"), desc: t("car.trust.warrantyDesc") },
    { icon: Award, title: t("car.trust.inspection"), desc: t("car.trust.inspectionDesc") },
    { icon: Truck, title: t("car.trust.delivery"), desc: t("car.trust.deliveryDesc") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-36 pb-12">
      <nav className="flex items-center gap-1.5 text-sm text-ink-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">{t("nav.home")}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/cars" className="hover:text-accent transition-colors">{t("car.breadcrumb.cars")}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink truncate">{c.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8 min-w-0">
          <CarGallery images={c.images ?? []} title={c.title} />

          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-muted">
              <span>{c.brand}</span>
              <span className="text-line">•</span>
              <span>{c.carModel}</span>
              <span className="text-line">•</span>
              <span>{c.year}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink mt-2 leading-tight">{c.title}</h1>
          </div>

          {specs.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="text-lg font-semibold text-ink">{t("car.specifications")}</h2>
                  <div className="flex-1 h-px bg-line" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {specs.map((s) => (
                    <div key={s.label} className="flex items-start gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-ink-muted">{s.label}</div>
                        <div className="text-sm font-medium text-ink truncate capitalize">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {carSpecs.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="text-lg font-semibold text-ink">{t("car.features")}</h2>
                  <div className="flex-1 h-px bg-line" />
                </div>
                <div className="space-y-5">
                  {featureCategoryOrder.map((cat) => (
                    <div key={cat}>
                      <div className="text-[11px] uppercase tracking-wider text-ink-muted mb-3">
                        {cat}
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                        {featuresByCategory[cat].map((sp) => (
                          <li key={sp._id} className="flex items-start gap-2 text-sm text-ink-soft">
                            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="leading-tight">
                              <span className="text-ink">{sp.name}</span>
                              {sp.description ? (
                                <span className="block text-[11px] text-ink-muted">
                                  {sp.description}
                                </span>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-ink">{t("car.description")}</h2>
                <div className="flex-1 h-px bg-line" />
              </div>
              <p className="text-ink-soft leading-relaxed whitespace-pre-line">
                {c.description || t("car.noDescription")}
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="lg:sticky lg:top-32">
            <CardContent className="pt-6 space-y-5">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : c.status === "sold"
                        ? "bg-ink-muted/10 text-ink-muted"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isAvailable ? "bg-emerald-500 animate-pulse" : "bg-current"
                    }`}
                  />
                  {statusLabel}
                </span>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">{t("car.price")}</div>
                <div className="mt-1 text-3xl md:text-4xl font-bold text-ink tracking-tight">
                  {formatPrice(c.price)}
                </div>
              </div>

              <div className="h-px bg-line" />

              <AddToCartButton
                car={{
                  _id: String(c._id),
                  title: c.title,
                  brand: c.brand,
                  images: c.images ?? [],
                  price: c.price,
                  status: c.status,
                }}
              />

              <div className="pt-2 space-y-3">
                {trustItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink leading-tight">{item.title}</div>
                      <div className="text-xs text-ink-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
