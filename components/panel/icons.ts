import { LayoutDashboard, Car, Users, ShoppingBag, PlusCircle, Tag, Receipt, ListChecks, Images, type LucideIcon } from "lucide-react";

export type IconKey = "dashboard" | "car" | "users" | "orders" | "plus" | "tag" | "receipt" | "specs" | "carousel";

export const iconMap: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  car: Car,
  users: Users,
  orders: ShoppingBag,
  plus: PlusCircle,
  tag: Tag,
  receipt: Receipt,
  specs: ListChecks,
  carousel: Images,
};
