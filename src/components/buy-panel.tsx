"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productImage } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";

export function BuyPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [qty, setQty] = useState(1);

  function addToCart() {
    add(
      {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        price: product.price,
        size: size || undefined,
        image: productImage(product, 1),
      },
      qty,
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {product.sizes.length > 0 && (
        <label className="block">
          <span className="text-[11px] tracking-[0.24em] text-gold uppercase">
            {product.sizeLabel ?? "Размер"}
          </span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-2 w-full border border-gold/25 bg-ink px-3 py-3 text-ivory outline-none focus:border-gold"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="block">
        <span className="text-[11px] tracking-[0.24em] text-gold uppercase">Количество</span>
        <input
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="mt-2 w-24 border border-gold/25 bg-ink px-3 py-3 text-ivory outline-none focus:border-gold"
        />
      </label>
      <p className="font-serif text-3xl text-gold">{formatPrice(product.price)}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={addToCart}
          className="flex-1 bg-gold px-6 py-3.5 text-center text-xs tracking-[0.28em] text-ink uppercase transition hover:bg-gold-bright"
        >
          В корзину
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart();
            router.push("/checkout");
          }}
          className="flex-1 border border-gold px-6 py-3.5 text-center text-xs tracking-[0.28em] text-gold uppercase transition hover:bg-gold/10"
        >
          Купить
        </button>
      </div>
    </div>
  );
}
