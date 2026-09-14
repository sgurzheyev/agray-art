import type { Metadata } from "next";
import { BrandName } from "@/components/brand-name";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Вход · админка" };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <BrandName as="p" className="text-3xl text-silver" />
      <h1 className="mt-4 font-serif text-3xl text-ivory">Вход в ателье</h1>
      <p className="mt-2 text-sm text-muted">Только для Андрея. Каталог на сайте не требует входа.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
