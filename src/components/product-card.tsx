import Link from "next/link";
import { productImage } from "@/lib/products";
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
          loading="lazy"
          decoding="async"
          className="h-full w-full bg-black object-contain object-center transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 product-chrome" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-silver/80 uppercase">
            {product.categoryName ?? product.category}
          </p>
          <h3 className="mt-1 font-serif text-xl text-ivory group-hover:text-silver-bright">
            {product.name}
          </h3>
          <p className="mt-1 text-xs tracking-widest text-muted">{product.sku}</p>
        </div>
        <p className="shrink-0 text-sm text-silver">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
