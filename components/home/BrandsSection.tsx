"use client";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { useEffect, useRef, useState } from "react";

type Brand = {
  _id: string;
  name: string;
  logo: string;
  itemCount: number;
};

export default function BrandsSection() {
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

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-cream py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading title="Shop by" highlight="Brand" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/cars?brand=${encodeURIComponent(brand.name)}`}
              className="block"
            >
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lift transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-line group">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center group-hover:bg-accent-soft transition-colors overflow-hidden">
                  {brand.logo ? (
                    <Image src={brand.logo} alt={brand.name} width={48} height={48} className="object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-ink-muted group-hover:text-accent transition-colors">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-ink text-sm">{brand.name}</h3>
                <p className="text-xs text-ink-muted mt-1">{brand.itemCount} cars</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
