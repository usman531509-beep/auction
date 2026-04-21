"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Settings, LogOut, Menu, X, Mail, Headphones } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Auctions", href: "/auctions" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // On non-home pages, always use solid style
  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/95 backdrop-blur-md shadow-card border-b border-line"
          : "bg-transparent"
      }`}
    >
      {/* Top info bar */}
      <div
        className={`transition-all duration-300 ${
          solid
            ? "bg-ink border-b border-white/10"
            : "bg-black/40 backdrop-blur-sm border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 text-white/70 text-sm">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              info@kurumalink.com
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5" />
              Customer support
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <Link href="/auctions" className="hover:text-white transition-colors">
              How To Bid
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Sell Your Item
            </Link>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-white/50">Language</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg group">
          <Image
            src="/logo.png"
            alt="クルマリンク"
            width={40}
            height={40}
            className="h-16 w-16 object-contain transition-transform group-hover:scale-110"
          />
          <span className={solid ? "text-ink" : "text-white"}>クルマリンク</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  solid
                    ? isActive
                      ? "text-accent bg-accent-soft"
                      : "text-ink hover:bg-surface"
                    : isActive
                      ? "text-white bg-white/15"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors ${solid ? "hover:bg-surface" : "hover:bg-white/10"}`}>
                  <Avatar className="h-8 w-8 border-2 border-accent">
                    <AvatarFallback className="bg-accent text-white text-xs font-bold">
                      {(user.name ?? "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="h-4 w-4" /> Admin panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className={
                  solid
                    ? ""
                    : "border-white/30 text-white bg-transparent hover:bg-white/10"
                }
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-accent hover:bg-accent-hover text-white"
              >
                <Link href="/register">My Account</Link>
              </Button>
            </>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className={`h-6 w-6 ${solid ? "text-ink" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${solid ? "text-ink" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-line shadow-lift-lg animate-fade-up">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent bg-accent-soft"
                      : "text-ink hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
