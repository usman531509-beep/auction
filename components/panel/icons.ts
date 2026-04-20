import { LayoutDashboard, Gavel, Users, Receipt, PlusCircle, Tag, type LucideIcon } from "lucide-react";

export type IconKey = "dashboard" | "gavel" | "users" | "receipt" | "plus" | "tag";

export const iconMap: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  gavel: Gavel,
  users: Users,
  receipt: Receipt,
  plus: PlusCircle,
  tag: Tag,
};
