import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users });
}
