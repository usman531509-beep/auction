"use client";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import CarouselNav from "./CarouselNav";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Brand = {
  _id: string;
  name: string;
  logo: string;
  itemCount: number;
};

export default function CategorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        setBrands(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Trigger animation after brands load
  useEffect(() => {
    if (!loaded || brands.length === 0) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded, brands.length]);

  // Don't render if loaded and no brands
  if (loaded && brands.length === 0) return null;
  // Don't render while loading
  if (!loaded) return null;

  return (
    <section ref={sectionRef} className="animate-on-scroll bg-cream py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading title="Explore" highlight="Brands" />
          <CarouselNav onPrev={scrollPrev} onNext={scrollNext} />
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-5">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/auctions?brand=${encodeURIComponent(brand.name)}`}
                className="flex-shrink-0 basis-[calc(16.666%-14px)] min-w-[160px]"
              >
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lift transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-transparent hover:border-line group">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center group-hover:bg-accent-soft transition-colors overflow-hidden">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold text-ink-muted group-hover:text-accent transition-colors">
                        {brand.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-ink text-sm">{brand.name}</h3>
                 
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent transition-colors underline underline-offset-4"
          >
            View All Brands
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
