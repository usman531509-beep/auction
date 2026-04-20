import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PanelShell from "@/components/panel/PanelShell";
import type { NavItem } from "@/components/panel/Sidebar";

const items: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/dashboard/bids", label: "My bids", icon: "receipt" },
  { href: "/auctions", label: "Browse auctions", icon: "gavel" },
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
