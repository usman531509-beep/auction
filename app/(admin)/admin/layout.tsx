import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PanelShell from "@/components/panel/PanelShell";
import type { NavItem } from "@/components/panel/Sidebar";

const items: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "dashboard" },
  { href: "/admin/cars", label: "Cars", icon: "car" },
  { href: "/admin/brands", label: "Brands", icon: "tag" },
  { href: "/admin/orders", label: "Orders", icon: "orders" },
  { href: "/admin/users", label: "Users", icon: "users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/");

  return (
    <PanelShell title="クルマリンク" subtitle="Admin portal" items={items} breadcrumb="Overview">
      {children}
    </PanelShell>
  );
}
