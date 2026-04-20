"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { iconMap } from "./icons";
import type { NavItem } from "./Sidebar";

export default function MobileSidebar({ title, subtitle, items }: { title: string; subtitle: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-surface text-ink w-72">
        <div className="px-5 pt-6 pb-4">
          <div className="text-[10px] tracking-[0.2em] text-ink-muted font-semibold">
            {subtitle.toUpperCase()}
          </div>
          <div className="text-lg font-semibold text-ink mt-0.5">Navigation</div>
        </div>
        <nav className="px-3 pb-4 space-y-2">
          {items.map((item) => {
            const active =
              path === item.href ||
              (item.href !== "/admin" && item.href !== "/dashboard" && path.startsWith(item.href));
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm border transition-all",
                  active
                    ? "bg-accent border-accent text-white shadow-card"
                    : "bg-white border-border text-ink hover:border-accent/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                    active ? "bg-white/15 text-white" : "bg-surface text-ink-soft border border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className={cn("font-medium", active ? "text-white" : "text-ink")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
