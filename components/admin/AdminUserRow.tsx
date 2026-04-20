"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield, ShieldOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";

type Props = {
  user: { _id: string; name: string; email: string; role: "user" | "admin"; createdAt: string };
};

export default function AdminUserRow({ user }: Props) {
  const router = useRouter();

  async function toggleRole() {
    const next = user.role === "admin" ? "user" : "admin";
    const res = await fetch(`/api/users/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    if (!res.ok) return toast.error("Failed");
    toast.success(`Role set to ${next}`);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete ${user.email}?`)) return;
    const res = await fetch(`/api/users/${user._id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Failed");
      return;
    }
    toast.success("User deleted");
    router.refresh();
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-ink-soft">{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
      </TableCell>
      <TableCell className="text-ink-muted text-xs" suppressHydrationWarning>{new Date(user.createdAt).toISOString().slice(0, 10)}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="outline" size="sm" onClick={toggleRole}>
          {user.role === "admin" ? <><ShieldOff className="h-3.5 w-3.5" /> Demote</> : <><Shield className="h-3.5 w-3.5" /> Promote</>}
        </Button>
        <Button variant="outline" size="sm" onClick={remove} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
