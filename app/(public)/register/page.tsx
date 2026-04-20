import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-28 pb-12">
      <h1 className="text-2xl font-semibold text-ink mb-6">Create an account</h1>
      <RegisterForm />
    </div>
  );
}
