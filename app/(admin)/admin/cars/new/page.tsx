import CarForm from "@/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New car</h1>
        <p className="text-sm text-ink-muted">Add a car to your store inventory.</p>
      </div>
      <CarForm />
    </div>
  );
}
