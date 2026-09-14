"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, total, setQty, remove, count } = useCart();

  if (count === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-3xl text-ivory">Корзина пуста</p>
        <p className="mt-3 text-muted">Откройте каталог — кольца, кресты, цепи, SPORT.</p>
        <Link
          href="/catalog"
          className="btn-glass-ghost mt-8 px-8 py-3 text-xs tracking-[0.28em]"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-silver/15">
        {items.map((item) => (
          <li key={`${item.slug}-${item.size ?? ""}`} className="flex gap-4 py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" className="size-28 object-cover bg-black" />
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <div>
                  <Link href={`/product/${item.slug}`} className="font-serif text-xl text-ivory hover:text-silver">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs tracking-widest text-muted">
                    {item.sku}
                    {item.size ? ` · ${item.size}` : ""}
                  </p>
                </div>
                <p className="text-silver">{formatPrice(item.price * item.qty)}</p>
              </div>
              <div className="mt-auto flex items-center gap-3 pt-4">
                <button
                  type="button"
                  className="border border-silver/30 p-1 text-silver"
                  onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                  aria-label="Меньше"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-6 text-center text-sm">{item.qty}</span>
                <button
                  type="button"
                  className="border border-silver/30 p-1 text-silver"
                  onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                  aria-label="Больше"
                >
                  <Plus className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="ml-2 text-muted hover:text-silver"
                  onClick={() => remove(item.slug, item.size)}
                  aria-label="Удалить"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-silver/20 p-6">
        <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Итого</p>
        <p className="mt-3 font-serif text-3xl text-ivory">{formatPrice(total)}</p>
        <p className="mt-2 text-xs text-muted">Доставка и гравировка уточняются в ателье после оплаты.</p>
        <Link
          href="/checkout"
          className="btn-glass mt-6 w-full py-3 text-center text-xs tracking-[0.28em]"
        >
          Оформить
        </Link>
      </aside>
    </div>
  );
}

export function CheckoutForm() {
  const { items, total, clear, count } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Москва",
    notes: "",
  });

  if (count === 0) {
    return (
      <p className="text-muted">
        Корзина пуста.{" "}
        <Link href="/catalog" className="text-silver">
          Вернуться в каталог
        </Link>
      </p>
    );
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Не удалось создать сессию оплаты");
        return;
      }
      if (data.url.includes("/checkout/success")) clear();
      window.location.href = data.url;
    } catch {
      setError("Сеть недоступна. Попробуйте снова.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={pay} className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        {(
          [
            ["name", "Имя", "text"],
            ["phone", "Телефон", "tel"],
            ["email", "Email", "email"],
            ["city", "Город", "text"],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="text-[11px] tracking-[0.22em] text-silver uppercase">{label}</span>
            <input
              required
              type={type}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="mt-2 w-full border border-silver/25 bg-transparent px-3 py-3 text-ivory outline-none focus:border-silver"
            />
          </label>
        ))}
        <label className="block">
          <span className="text-[11px] tracking-[0.22em] text-silver uppercase">Комментарий</span>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Гравировка, размер, удобное время примерки"
            className="mt-2 w-full border border-silver/25 bg-transparent px-3 py-3 text-ivory outline-none placeholder:text-muted focus:border-silver"
          />
        </label>
      </div>
      <div className="border border-silver/20 p-6">
        <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Заказ</p>
        <ul className="mt-4 space-y-2 text-sm text-ivory/80">
          {items.map((i) => (
            <li key={`${i.slug}-${i.size}`} className="flex justify-between gap-3">
              <span>
                {i.name}
                {i.size ? ` · ${i.size}` : ""} × {i.qty}
              </span>
              <span className="text-silver">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-serif text-3xl text-ivory">{formatPrice(total)}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Оплата через Stripe test-mode. Без ключей откроется демо-успех. Живые ключи — в{" "}
          <code className="text-ivory/70">.env.local</code>, инструкция в README.
        </p>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn-glass mt-6 w-full py-3.5 text-xs tracking-[0.28em] disabled:opacity-60"
        >
          {busy ? "Создание сессии…" : "Оплатить"}
        </button>
      </div>
    </form>
  );
}
