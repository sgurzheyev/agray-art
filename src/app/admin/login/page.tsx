import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Вход · админка" };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <p className="font-serif text-3xl tracking-[0.28em] text-silver">A.GRAY</p>
      <h1 className="mt-4 font-serif text-3xl text-ivory">Вход в ателье</h1>
      <p className="mt-2 text-sm text-muted">Только для Андрея. Каталог на сайте не требует входа.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
