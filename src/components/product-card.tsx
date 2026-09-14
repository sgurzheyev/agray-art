import Link from "next/link";
import { categoryName, productImage } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImage(product, 1)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/15 ring-inset" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-gold/80 uppercase">
            {categoryName(product.category)}
          </p>
          <h3 className="mt-1 font-serif text-xl text-ivory group-hover:text-gold">
            {product.name}
          </h3>
          <p className="mt-1 text-xs tracking-widest text-muted">{product.sku}</p>
        </div>
        <p className="shrink-0 text-sm text-gold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
