"use client";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Brand = {
  _id: string;
  name: string;
  logo: string;
  itemCount: number;
  category?: "domestic" | "imported";
};

export default function BrandsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        setBrands(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded || brands.length === 0) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loaded, brands.length]);

  if (!loaded || brands.length === 0) return null;

  const domestic = brands.filter((b) => (b.category ?? "imported") === "domestic");
  const imported = brands.filter((b) => (b.category ?? "imported") === "imported");

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-cream py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <SectionHeading title={t("home.brands.title")} highlight={t("home.brands.highlight")} />
        </div>

        {domestic.length > 0 && (
          <BrandRow label={t("home.brands.domestic")} brands={domestic} carsSuffix={t("home.brands.carsSuffix")} />
        )}
        {imported.length > 0 && (
          <div className={domestic.length > 0 ? "mt-6" : ""}>
            <BrandRow label={t("home.brands.imported")} brands={imported} carsSuffix={t("home.brands.carsSuffix")} />
          </div>
        )}
      </div>
    </section>
  );
}

function BrandRow({
  label,
  brands,
  carsSuffix,
}: {
  label: string;
  brands: Brand[];
  carsSuffix: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-soft uppercase tracking-wider mb-2">{label}</h3>
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-px-1 scrollbar-thin">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/cars?brand=${encodeURIComponent(brand.name)}`}
              className="group flex-shrink-0 w-[88px] snap-start"
            >
              <div className="p-2 text-center transition-all duration-300 hover:-translate-y-0.5">
                <div className="h-10 w-10 mx-auto mb-1.5 flex items-center justify-center overflow-hidden">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={40}
                      height={40}
                      className="object-contain transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-sm font-bold text-ink-muted group-hover:text-accent transition-colors">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-ink text-xs group-hover:text-accent transition-colors truncate">
                  {brand.name}
                </h4>
                <p className="text-[10px] text-ink-muted mt-0.5">
                  {brand.itemCount} {carsSuffix}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
