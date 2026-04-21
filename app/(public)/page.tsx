import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { sweepExpiredAuctions } from "@/lib/auctions";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

function DebugError({ title, err }: { title: string; err: any }) {
  return (
    <div style={{ padding: 32, fontFamily: "monospace", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ color: "#b91c1c", fontSize: 20, marginBottom: 12 }}>[DEBUG] {title}</h1>
      <div style={{ marginBottom: 8 }}>
        <strong>name:</strong> {String(err?.name ?? "")}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>message:</strong> {String(err?.message ?? err)}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>code:</strong> {String(err?.code ?? "")}
      </div>
      <pre style={{ background: "#f3f4f6", padding: 16, whiteSpace: "pre-wrap", fontSize: 12 }}>
        {String(err?.stack ?? "")}
      </pre>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
        MONGODB_URI set: {process.env.MONGODB_URI ? "yes" : "NO"} · length:{" "}
        {process.env.MONGODB_URI?.length ?? 0}
        <br />
        AUTH_SECRET set: {process.env.AUTH_SECRET ? "yes" : "NO"}
        <br />
        NEXTAUTH_SECRET set: {process.env.NEXTAUTH_SECRET ? "yes" : "NO"}
        <br />
        NEXTAUTH_URL: {process.env.NEXTAUTH_URL ?? "(unset)"}
      </div>
    </div>
  );
}

export default async function HomePage() {
  try {
    await dbConnect();
  } catch (e: any) {
    return <DebugError title="DB connect failed" err={e} />;
  }

  try {
    await sweepExpiredAuctions();
  } catch (e: any) {
    return <DebugError title="sweepExpiredAuctions failed" err={e} />;
  }

  let featured: any[] = [];
  let allActive: any[] = [];
  let latest: any[] = [];
  try {
    [featured, allActive, latest] = await Promise.all([
      Auction.find({ featured: true, status: "active" }).sort({ endTime: 1 }).limit(12).lean(),
      Auction.find({ status: "active" }).sort({ currentPrice: -1 }).limit(20).lean(),
      Auction.find({ status: "active" }).sort({ createdAt: -1 }).limit(12).lean(),
    ]);
  } catch (e: any) {
    return <DebugError title="Auction queries failed" err={e} />;
  }

  const serialize = (a: any) => ({
    _id: String(a._id),
    title: a.title,
    brand: a.brand,
    carModel: a.carModel,
    year: a.year,
    images: a.images,
    currentPrice: a.currentPrice,
    endTime: a.endTime.toISOString(),
    status: a.status,
  });

  return (
    <HomeClient
      featured={featured.map(serialize)}
      allActive={allActive.map(serialize)}
      latest={latest.map(serialize)}
    />
  );
}
