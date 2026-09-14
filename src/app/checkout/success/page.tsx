import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Заказ принят" };

type Props = { searchParams: Promise<{ demo?: string; session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { demo, session_id } = await searchParams;
  const isDemo = demo === "1" || !session_id;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">A.GRAY</p>
      <h1 className="mt-4 font-serif text-4xl text-ivory">Спасибо</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {isDemo
          ? "Демо-оплата без Stripe-ключей. Когда появятся sk_test / pk_test, эта страница будет открываться после настоящего Checkout."
          : "Оплата прошла в тестовом Stripe. Ателье свяжется по контактам из формы."}
      </p>
      {session_id && (
        <p className="mt-3 break-all text-xs text-muted/70">session: {session_id}</p>
      )}
      <Link
        href="/catalog"
        className="mt-10 inline-block border border-gold px-8 py-3 text-xs tracking-[0.28em] text-gold uppercase"
      >
        Вернуться в каталог
      </Link>
    </div>
  );
}
