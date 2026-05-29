"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Spec = {
  _id: string;
  name: string;
  category: string;
  description: string;
};

export default function SpecList({
  specs,
  categories,
}: {
  specs: Spec[];
  categories: string[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditId(null);
    setName("");
    setCategory("");
    setDescription("");
    setShowForm(true);
  }

  function openEdit(s: Spec) {
    setEditId(s._id);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setName("");
    setCategory("");
    setDescription("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    const url = editId ? `/api/specs/${editId}` : "/api/specs";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Failed to save");
      return;
    }
    toast.success(editId ? "Specification updated" : "Specification created");
    closeForm();
    router.refresh();
  }

  async function onDelete(s: Spec) {
    if (!confirm(`Delete "${s.name}"? It will be removed from all cars that have it.`)) return;
    const res = await fetch(`/api/specs/${s._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Specification deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Specifications</h1>
          <p className="text-sm text-ink-muted">
            Manage the catalog of car specifications (airbags, suspension, ABS, etc.). Admin selects
            them per car from the car form.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusCircle className="h-4 w-4" /> Add specification
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">
                {editId ? "Edit specification" : "New specification"}
              </h2>
              <button type="button" onClick={closeForm}>
                <X className="h-5 w-5 text-ink-muted hover:text-ink" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Front airbags"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category (optional)</Label>
                <Input
                  list="spec-categories"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Safety"
                />
                <datalist id="spec-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label>Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Short description for staff reference"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button disabled={saving}>
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specs.map((s) => (
              <TableRow key={s._id}>
                <TableCell className="font-medium text-ink">{s.name}</TableCell>
                <TableCell>
                  {s.category ? (
                    <Badge variant="secondary">{s.category}</Badge>
                  ) : (
                    <span className="text-ink-muted text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-ink-soft text-sm max-w-[420px] truncate">
                  {s.description || <span className="text-ink-muted">—</span>}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(s)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {specs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-ink-muted">
                  No specifications yet. Click &quot;Add specification&quot; to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
