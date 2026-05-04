import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Car from "@/models/Car";
import Order from "@/models/Order";
import User from "@/models/User";
import { orderSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(500)
    .populate({ path: "userId", model: User, select: "name email" })
    .lean();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await auth();
  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const ids = parsed.data.items
    .map((i) => i.carId)
    .filter((id) => mongoose.isValidObjectId(id));
  if (ids.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const cars = await Car.find({ _id: { $in: ids }, status: "available" }).lean();
  const carMap = new Map(cars.map((c: any) => [String(c._id), c]));

  const items = [];
  let total = 0;
  for (const it of parsed.data.items) {
    const c = carMap.get(it.carId);
    if (!c) {
      return NextResponse.json({ error: `Car ${it.carId} unavailable` }, { status: 409 });
    }
    const qty = Math.max(1, it.quantity);
    items.push({
      carId: c._id,
      title: c.title,
      brand: c.brand,
      image: c.images?.[0] ?? "",
      price: c.price,
      quantity: qty,
    });
    total += c.price * qty;
  }

  const order = await Order.create({
    userId: session?.user?.id ?? null,
    name: parsed.data.name,
    email: parsed.data.email,
    contact: parsed.data.contact,
    address: parsed.data.address,
    notes: parsed.data.notes,
    items,
    total,
    status: "pending",
  });

  return NextResponse.json({ ok: true, orderId: String(order._id), total }, { status: 201 });
}
