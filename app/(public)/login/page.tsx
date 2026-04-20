import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-28 pb-12">
      <h1 className="text-2xl font-semibold text-ink mb-6">Log in</h1>
      <LoginForm callbackUrl={searchParams.callbackUrl ?? "/"} />
    </div>
  );
}
