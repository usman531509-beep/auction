import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { requireUser } from "@/lib/authz";

export async function GET() {
  const { error, session } = await requireUser();
  if (error) return error;
  await dbConnect();
  const orders = await Order.find({
    $or: [{ userId: session!.user.id }, { email: session!.user.email }],
  })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  return NextResponse.json({ orders });
}
