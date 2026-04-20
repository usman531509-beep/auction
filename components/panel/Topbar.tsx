"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Home, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MobileSidebar from "./MobileSidebar";
import type { NavItem } from "./Sidebar";

type Props = {
  title: string;
  subtitle: string;
  items: NavItem[];
  breadcrumb?: string;
  user: { name?: string | null; email?: string | null; role: string };
};

export default function Topbar({ title, subtitle, items, breadcrumb, user }: Props) {
  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-border flex items-center gap-2 px-4">
      <MobileSidebar title={title} subtitle={subtitle} items={items} />
      <Link href="/" className="hidden md:flex items-center gap-2 mr-4">
        <span className="inline-block h-7 w-7 rounded-md bg-accent" />
        <span className="font-semibold text-ink">{title}</span>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-ink-muted">{subtitle}</div>
        <div className="text-sm font-medium text-ink truncate">{breadcrumb ?? "Overview"}</div>
      </div>
      <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
        <Link href="/"><Home className="h-4 w-4" /> Site</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-medium text-ink">{user.name}</div>
              <div className="text-[10px] text-ink-muted uppercase">{user.role}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard"><UserIcon className="h-4 w-4" /> My dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
