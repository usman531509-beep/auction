"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { iconMap, type IconKey } from "./icons";

export type NavItem = { href: string; label: string; icon: IconKey };

type Props = {
  title: string;
  subtitle: string;
  items: NavItem[];
  footer?: React.ReactNode;
};

export default function Sidebar({ subtitle, items, footer }: Props) {
  const path = usePathname();
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col border-r border-border bg-surface">
      <div className="px-5 pt-6 pb-4">
        <div className="text-[10px] tracking-[0.2em] text-ink-muted font-semibold">
          {subtitle.toUpperCase()}
        </div>
        <div className="text-lg font-semibold text-ink mt-0.5">Navigation</div>
      </div>
      <nav className="flex-1 px-3 pb-4 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const active =
            path === item.href ||
            (item.href !== "/admin" && item.href !== "/dashboard" && path.startsWith(item.href));
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm border transition-all",
                active
                  ? "bg-accent border-accent text-white shadow-card"
                  : "bg-white border-border text-ink hover:border-accent/40 hover:shadow-card"
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
      {footer && <div className="p-3 border-t border-border">{footer}</div>}
    </aside>
  );
}
