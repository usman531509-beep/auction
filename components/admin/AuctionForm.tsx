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
  startingPrice: number | "";
  startTime: string;
  endTime: string;
  images: string[];
};

function toLocalInput(d?: string | Date) {
  if (!d) return "";
  const date = new Date(d);
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60_000).toISOString().slice(0, 16);
}

export default function AuctionForm({ auction }: { auction?: any }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [v, setV] = useState<Values>({
    title: auction?.title ?? "",
    brand: auction?.brand ?? "",
    carModel: auction?.carModel ?? "",
    year: auction?.year ?? "",
    description: auction?.description ?? "",
    startingPrice: auction?.startingPrice ?? "",
    startTime: toLocalInput(auction?.startTime),
    endTime: toLocalInput(auction?.endTime),
    images: auction?.images ?? [],
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
    const payload = {
      ...v,
      startTime: v.startTime ? new Date(v.startTime).toISOString() : "",
      endTime: v.endTime ? new Date(v.endTime).toISOString() : "",
    };
    const url = auction ? `/api/auctions/${auction._id}` : "/api/auctions";
    const method = auction ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Failed to save");
      return;
    }
    toast.success(auction ? "Auction updated" : "Auction created");
    router.push("/admin/auctions");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle details</CardTitle>
          <CardDescription>Core information shown on the auction card and detail page.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title"><Input required value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Brand">
            <select
              required
              value={v.brand}
              onChange={(e) => set("brand", e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="">Select a brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Model"><Input required value={v.carModel} onChange={(e) => set("carModel", e.target.value)} /></Field>
          <Field label="Year"><Input required type="number" value={v.year} onChange={(e) => set("year", Number(e.target.value) || "")} /></Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea value={v.description} onChange={(e) => set("description", e.target.value)} rows={4} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & schedule</CardTitle>
          <CardDescription>When bidding opens and closes. End time must be after start time.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Starting price (JPY)">
            <Input required type="number" min={0} value={v.startingPrice} onChange={(e) => set("startingPrice", Number(e.target.value) || "")} />
          </Field>
          <Field label="Start time">
            <Input required type="datetime-local" value={v.startTime} onChange={(e) => set("startTime", e.target.value)} />
          </Field>
          <Field label="End time">
            <Input required type="datetime-local" value={v.endTime} onChange={(e) => set("endTime", e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Upload photos from your device. First image is used as the cover. JPG, PNG, WebP, GIF up to 5MB each.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFiles(e.dataTransfer.files);
            }}
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
                <span className="text-xs text-ink-muted">Stored locally in /public/uploads</span>
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
        <Button disabled={loading || uploading}>{loading ? "Saving..." : auction ? "Update auction" : "Create auction"}</Button>
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
