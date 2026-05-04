"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Values = {
  title: string;
  brand: string;
  carModel: string;
  year: number | "";
  description: string;
  price: number | "";
  mileage: number | "";
  color: string;
  transmission: "automatic" | "manual" | "";
  fuel: "petrol" | "diesel" | "hybrid" | "electric" | "";
  stock: number | "";
  status: "available" | "sold" | "hidden";
  images: string[];
};

const selectClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export default function CarForm({ car }: { car?: any }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [v, setV] = useState<Values>({
    title: car?.title ?? "",
    brand: car?.brand ?? "",
    carModel: car?.carModel ?? "",
    year: car?.year ?? "",
    description: car?.description ?? "",
    price: car?.price ?? "",
    mileage: car?.mileage ?? "",
    color: car?.color ?? "",
    transmission: car?.transmission ?? "",
    fuel: car?.fuel ?? "",
    stock: car?.stock ?? 1,
    status: car?.status ?? "available",
    images: car?.images ?? [],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function set<K extends keyof Values>(k: K, val: Values[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(`${file.name}: ${j.error || "upload failed"}`);
        continue;
      }
      uploaded.push(j.url);
    }
    if (uploaded.length) {
      set("images", [...v.images, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = car ? `/api/cars/${car._id}` : "/api/cars";
    const method = car ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Failed to save");
      return;
    }
    toast.success(car ? "Car updated" : "Car created");
    router.push("/admin/cars");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle details</CardTitle>
          <CardDescription>Core information shown on the car card and detail page.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title"><Input required value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Brand">
            <select
              required
              value={v.brand}
              onChange={(e) => set("brand", e.target.value)}
              className={selectClass}
            >
              <option value="">Select a brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Model"><Input required value={v.carModel} onChange={(e) => set("carModel", e.target.value)} /></Field>
          <Field label="Year"><Input required type="number" value={v.year} onChange={(e) => set("year", Number(e.target.value) || "")} /></Field>
          <Field label="Color"><Input value={v.color} onChange={(e) => set("color", e.target.value)} /></Field>
          <Field label="Mileage (km)"><Input type="number" min={0} value={v.mileage} onChange={(e) => set("mileage", Number(e.target.value) || "")} /></Field>
          <Field label="Transmission">
            <select className={selectClass} value={v.transmission} onChange={(e) => set("transmission", e.target.value as any)}>
              <option value="">—</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </Field>
          <Field label="Fuel">
            <select className={selectClass} value={v.fuel} onChange={(e) => set("fuel", e.target.value as any)}>
              <option value="">—</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea value={v.description} onChange={(e) => set("description", e.target.value)} rows={4} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & stock</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Price (JPY)">
            <Input required type="number" min={0} value={v.price} onChange={(e) => set("price", Number(e.target.value) || "")} />
          </Field>
          <Field label="Stock">
            <Input type="number" min={0} value={v.stock} onChange={(e) => set("stock", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Status">
            <select className={selectClass} value={v.status} onChange={(e) => set("status", e.target.value as any)}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="hidden">Hidden</option>
            </select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Upload photos. First image is used as the cover.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl bg-surface py-10 cursor-pointer hover:border-accent hover:bg-accent-soft/40 transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 text-accent animate-spin" />
                <span className="text-sm text-ink-soft">Uploading...</span>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-ink">Choose images or drag & drop</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>

          {v.images.length > 0 && (
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {v.images.map((u, i) => (
                <li key={`${u}-${i}`} className="relative border border-border rounded-md overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="aspect-[4/3] w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-accent text-white text-[10px] font-medium px-1.5 py-0.5">Cover</span>
                  )}
                  <button
                    type="button"
                    onClick={() => set("images", v.images.filter((_, j) => j !== i))}
                    className="absolute top-1.5 right-1.5 bg-white/95 border border-border rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button disabled={loading || uploading}>{loading ? "Saving..." : car ? "Update car" : "Create car"}</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
