"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Car, Calendar, Gauge } from "lucide-react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["dream car", "best deal", "next ride", "perfect bid", "top pick"],
    []
  );
  const [brands, setBrands] = useState<{ name: string }[]>([]);
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [maxPrice] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber(titleNumber === titles.length - 1 ? 0 : titleNumber + 1);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  useEffect(() => {
    setLoaded(true);
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(() => {});
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    setModel("");
    setModels([]);
    if (!brand) return;
    fetch(`/api/auctions?brand=${encodeURIComponent(brand)}&limit=60`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.auctions) {
          const uniqueModels = Array.from(
            new Set(data.auctions.map((a: any) => a.carModel).filter(Boolean))
          ) as string[];
          setModels(uniqueModels.sort());
        }
      })
      .catch(() => {});
  }, [brand]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (keyword.trim()) sp.set("q", keyword.trim());
    if (brand) sp.set("brand", brand);
    if (model) sp.set("model", model);
    if (year) sp.set("year", year);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    window.location.href = `/auctions${sp.toString() ? `?${sp.toString()}` : ""}`;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ink">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2000&auto=format&fit=crop')",
          transform: loaded ? "scale(1)" : "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32">
        <div className="max-w-2xl">
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span>Find your</span>
            <span className="relative flex w-full overflow-hidden md:pb-4 md:pt-1 h-[1.2em]">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold italic text-accent"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
            <span>at our auction.</span>
          </h1>

          <p
            className={`text-lg text-white/70 mb-8 max-w-md transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Live auctions on hand-picked vehicles. Transparent bidding, fair
            pricing, zero hassle.
          </p>

          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-7 py-3.5 rounded-lg font-medium transition-all hover:shadow-lift-lg hover:-translate-y-0.5"
            >
              Start A Bid
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-lg font-medium transition-all hover:-translate-y-0.5"
            >
              View All Auction
            </Link>
          </div>
        </div>

        {/* Car Finder */}
        <div
          className={`mt-12 max-w-5xl transition-all duration-700 delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 md:p-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-3">
              {/* Keyword */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search cars..."
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all"
                />
              </div>

              {/* Brand */}
              <div className="relative">
                <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all cursor-pointer [&>option]:text-ink [&>option]:bg-white"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Model — visible after brand selected */}
              <div className="relative">
                <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&>option]:text-ink [&>option]:bg-white"
                >
                  <option value="">{brand ? "All Models" : "Select Modal"}</option>
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Year */}
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-all cursor-pointer [&>option]:text-ink [&>option]:bg-white"
                >
                  <option value="">Any Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl py-3 px-6 text-sm font-semibold transition-all hover:shadow-lift-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="h-4 w-4" />
                Find Cars
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["Tesla", "BMW", "Mercedes", "Toyota"].map((tag) => {
              const exists = brands.some((b) => b.name === tag);
              if (!exists && brands.length > 0) return null;
              return (
                <Link
                  key={tag}
                  href={`/auctions?brand=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-xs px-3.5 py-1.5 rounded-full transition-all"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {tag}
                </Link>
              );
            })}
            <Link
              href="/auctions"
              className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs px-3.5 py-1.5 rounded-full transition-all"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
