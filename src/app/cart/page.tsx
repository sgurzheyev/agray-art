import type { Metadata } from "next";
import { CartView } from "@/components/cart-views";

export const metadata: Metadata = { title: "Корзина" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Заказ</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Корзина</h1>
      <div className="mt-10">
        <CartView />
      </div>
    </div>
  );
}
