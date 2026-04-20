import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { sweepExpiredAuctions } from "@/lib/auctions";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const closed = await sweepExpiredAuctions();
  return NextResponse.json({ closed });
}
