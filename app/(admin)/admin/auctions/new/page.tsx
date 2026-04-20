import AuctionForm from "@/components/admin/AuctionForm";

export default function NewAuctionPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New auction</h1>
        <p className="text-sm text-ink-muted">Once created, this auction will appear immediately on the home page and auctions list.</p>
      </div>
      <AuctionForm />
    </div>
  );
}
