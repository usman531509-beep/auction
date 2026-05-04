"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, X, Loader2, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Brand = {
  _id: string;
  name: string;
  logo: string;
  itemCount: number;
};

export default function BrandList({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function openCreate() {
    setEditId(null);
    setName("");
    setLogo("");
    setShowForm(true);
  }

  function openEdit(brand: Brand) {
    setEditId(brand._id);
    setName(brand.name);
    setLogo(brand.logo);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setName("");
    setLogo("");
  }

  async function onLogoUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", files[0]);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(j.error || "Upload failed");
    } else {
      setLogo(j.url);
      toast.success("Logo uploaded");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Brand name is required");
    setSaving(true);

    const url = editId ? `/api/brands/${editId}` : "/api/brands";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), logo }),
    });

    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Failed to save");
      return;
    }

    toast.success(editId ? "Brand updated" : "Brand created");
    closeForm();
    router.refresh();
  }

  async function onDelete(brand: Brand) {
    if (!confirm(`Delete brand "${brand.name}"? This won't affect existing cars.`)) return;
    const res = await fetch(`/api/brands/${brand._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Brand deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
          <p className="text-sm text-ink-muted">
            Manage car brands. These appear in the car form and on the home page.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusCircle className="h-4 w-4" /> Add brand
        </Button>
      </div>

      {/* Inline form */}
      {showForm && (
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">
                {editId ? "Edit brand" : "New brand"}
              </h2>
              <button type="button" onClick={closeForm}>
                <X className="h-5 w-5 text-ink-muted hover:text-ink" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Brand name</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Toyota"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Logo</Label>
                <div className="flex items-center gap-3">
                  {logo ? (
                    <div className="relative h-12 w-12 rounded-lg border border-line overflow-hidden bg-surface flex-shrink-0">
                      <Image
                        src={logo}
                        alt={name}
                        fill
                        className="object-contain p-1"
                      />
                      <button
                        type="button"
                        onClick={() => setLogo("")}
                        className="absolute -top-1 -right-1 bg-white border border-line rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 border border-dashed border-line rounded-lg px-4 py-2.5 cursor-pointer hover:border-accent hover:bg-accent-soft/40 transition-colors">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      ) : (
                        <ImagePlus className="h-4 w-4 text-ink-muted" />
                      )}
                      <span className="text-sm text-ink-muted">
                        {uploading ? "Uploading..." : "Upload logo"}
                      </span>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) => onLogoUpload(e.target.files)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button disabled={saving || uploading}>
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Brands table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Available Cars</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  {brand.logo ? (
                    <div className="relative h-10 w-10 rounded-lg border border-line overflow-hidden bg-surface">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-surface border border-line flex items-center justify-center">
                      <span className="text-sm font-bold text-ink-muted">
                        {brand.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-ink">{brand.name}</TableCell>
                <TableCell className="text-ink-muted">{brand.itemCount}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(brand)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(brand)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {brands.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-ink-muted">
                  No brands yet. Click &quot;Add brand&quot; to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
