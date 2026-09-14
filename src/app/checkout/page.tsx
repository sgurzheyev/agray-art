import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart-views";

export const metadata: Metadata = { title: "Оформление" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Stripe test-mode</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Оформление</h1>
      <p className="mt-3 text-sm text-muted">
        Данные уйдут в сессию Stripe. Без ключей — демо-подтверждение, деньги не списываются.
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
