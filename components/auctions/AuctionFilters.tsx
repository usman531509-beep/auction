"use client";
import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function AuctionFilters({ brands }: { brands: string[] }) {
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [model, setModel] = useState(params.get("model") ?? "");
  const [year, setYear] = useState(params.get("year") ?? "");
  const [minPrice, setMin] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMax] = useState(params.get("maxPrice") ?? "");

  const [allBrands, setAllBrands] = useState<string[]>(brands);
  const [models, setModels] = useState<string[]>([]);

  // Sync state from URL
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setBrand(params.get("brand") ?? "");
    setModel(params.get("model") ?? "");
    setYear(params.get("year") ?? "");
    setMin(params.get("minPrice") ?? "");
    setMax(params.get("maxPrice") ?? "");
  }, [params]);

  // Fetch all brands
  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const brandNames = data.map((b: any) => b.name);
          const merged = Array.from(new Set([...brands, ...brandNames])).sort();
          setAllBrands(merged);
        }
      })
      .catch(() => {});
  }, [brands]);

  // Fetch models when brand changes
  useEffect(() => {
    setModels([]);
    if (!brand) return;
    fetch(`/api/auctions?brand=${encodeURIComponent(brand)}&limit=60`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.auctions) {
          const unique = Array.from(
            new Set(data.auctions.map((a: any) => a.carModel).filter(Boolean))
          ) as string[];
          setModels(unique.sort());
        }
      })
      .catch(() => {});
  }, [brand]);

  function buildUrl(overrides: Record<string, string>) {
    const values = { q, brand, model, year, minPrice, maxPrice, ...overrides };
    // Reset model if brand changed
    if ("brand" in overrides && overrides.brand !== brand) {
      values.model = "";
    }
    const sp = new URLSearchParams();
    if (values.q?.trim()) sp.set("q", values.q.trim());
    if (values.brand) sp.set("brand", values.brand);
    if (values.model) sp.set("model", values.model);
    if (values.year) sp.set("year", values.year);
    if (values.minPrice) sp.set("minPrice", values.minPrice);
    if (values.maxPrice) sp.set("maxPrice", values.maxPrice);
    const qs = sp.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  function navigate(overrides: Record<string, string>) {
    window.location.href = buildUrl(overrides);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({ q });
    }
  }

  function onPriceKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({ minPrice, maxPrice });
    }
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const hasFilters = q || brand || model || year || minPrice || maxPrice;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-1.5">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <Input
                className="pl-8"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onSearchKeyDown}
                placeholder="Title, brand, model..."
              />
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-1.5">
            <Label>Brand</Label>
            <select
              className={selectClass}
              value={brand}
              onChange={(e) => navigate({ brand: e.target.value })}
            >
              <option value="">All</option>
              {allBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <Label>Model</Label>
            <select
              className={selectClass}
              value={model}
              onChange={(e) => navigate({ model: e.target.value })}
              disabled={!brand}
            >
              <option value="">{brand ? "All Models" : "Select brand"}</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-1.5">
            <Label>Year</Label>
            <select
              className={selectClass}
              value={year}
              onChange={(e) => navigate({ year: e.target.value })}
            >
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>

          {/* Max price */}
          <div className="space-y-1.5">
            <Label>Max price</Label>
            <Input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMax(e.target.value)}
              onKeyDown={onPriceKeyDown}
              placeholder="Any"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => { window.location.href = pathname; }}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
