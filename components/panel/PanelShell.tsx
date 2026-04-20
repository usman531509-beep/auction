import { auth } from "@/lib/auth";
import Sidebar, { type NavItem } from "./Sidebar";
import Topbar from "./Topbar";

type Props = {
  title: string;
  subtitle: string;
  items: NavItem[];
  breadcrumb?: string;
  children: React.ReactNode;
};

export default async function PanelShell({ title, subtitle, items, breadcrumb, children }: Props) {
  const session = await auth();
  const user = session!.user;

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar title={title} subtitle={subtitle} items={items} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} items={items} breadcrumb={breadcrumb} user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
