import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PanelShell from "@/components/panel/PanelShell";
import type { NavItem } from "@/components/panel/Sidebar";

const items: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/dashboard/orders", label: "My orders", icon: "orders" },
  { href: "/cars", label: "Browse cars", icon: "car" },
  { href: "/cart", label: "Cart", icon: "receipt" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  return (
    <PanelShell title="クルマリンク" subtitle="My account" items={items} breadcrumb="Overview">
      {children}
    </PanelShell>
  );
}
