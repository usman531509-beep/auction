"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Trash2, Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SafeImage from "@/components/ui/safe-image";

type Slide = {
  _id: string;
  image: string;
  caption: string;
  order: number;
  active: boolean;
};

export default function CarouselManager({ slides: initialSlides }: { slides: Slide[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const added: Slide[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const uj = await up.json().catch(() => ({}));
      if (!up.ok) {
        toast.error(`${file.name}: ${uj.error || "upload failed"}`);
        continue;
      }
      const create = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uj.url, caption }),
      });
      const cj = await create.json().catch(() => ({}));
      if (!create.ok) {
        toast.error(cj.error || "Failed to save slide");
        continue;
      }
      added.push({
        _id: String(cj._id),
        image: cj.image,
        caption: cj.caption ?? "",
        order: cj.order ?? slides.length + added.length,
        active: cj.active !== false,
      });
    }
    if (added.length) {
      toast.success(`Added ${added.length} slide${added.length === 1 ? "" : "s"}`);
      setSlides((s) => [...s, ...added]);
      setCaption("");
      router.refresh();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function patch(id: string, body: Partial<Slide>) {
    const res = await fetch(`/api/hero-slides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error("Failed to update");
      return false;
    }
    return true;
  }

  async function toggleActive(slide: Slide) {
    const next = !slide.active;
    setSlides((s) => s.map((x) => (x._id === slide._id ? { ...x, active: next } : x)));
    const ok = await patch(slide._id, { active: next });
    if (!ok) {
      setSlides((s) => s.map((x) => (x._id === slide._id ? { ...x, active: slide.active } : x)));
    } else {
      router.refresh();
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    const renumbered = next.map((s, i) => ({ ...s, order: i }));
    setSlides(renumbered);
    await Promise.all(
      [renumbered[index], renumbered[target]].map((s) =>
        patch(s._id, { order: s.order })
      )
    );
    router.refresh();
  }

  async function remove(slide: Slide) {
    if (!confirm("Remove this slide from the hero carousel?")) return;
    const res = await fetch(`/api/hero-slides/${slide._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Slide removed");
    setSlides((s) => s.filter((x) => x._id !== slide._id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hero Carousel</h1>
        <p className="text-sm text-ink-muted">
          Manage the background images on the home page hero. Slides auto-advance every 2 seconds.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add slides</CardTitle>
          <CardDescription>
            Recommended landscape ratio: 16:9 or wider (e.g. 2000×1125). For consistent appearance,
            upload images of similar dimensions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Caption (optional, for accessibility)</Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Premium Tesla Roadster"
            />
          </div>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slides ({slides.length})</CardTitle>
          <CardDescription>
            Use the arrows to reorder. Toggle the eye to deactivate without deleting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <p className="text-sm text-ink-muted py-10 text-center">
              No slides yet. Upload images above to start the hero carousel.
            </p>
          ) : (
            <ul className="space-y-3">
              {slides.map((s, i) => (
                <li
                  key={s._id}
                  className="flex items-center gap-4 p-3 border border-border rounded-lg bg-white"
                >
                  <div className="relative h-16 w-28 shrink-0 rounded-md overflow-hidden bg-surface">
                    <SafeImage
                      src={s.image}
                      alt={s.caption || "slide"}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">
                      {s.caption || <span className="text-ink-muted italic">no caption</span>}
                    </div>
                    <div className="text-xs text-ink-muted">
                      Position {i + 1} of {slides.length} · {s.active ? "Active" : "Hidden"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => move(i, 1)}
                      disabled={i === slides.length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(s)}
                      aria-label={s.active ? "Deactivate" : "Activate"}
                    >
                      {s.active ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(s)}
                      className="text-destructive hover:bg-destructive/10"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
