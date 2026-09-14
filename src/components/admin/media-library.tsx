"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Row = {
  id: string;
  url: string;
  kind: "photo" | "video";
  is_primary: boolean;
  product_id: string;
  products: { title_ru: string; sku: string } | { title_ru: string; sku: string }[] | null;
};

export function MediaLibrary() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data, error: err } = await supabase
      .from("product_media")
      .select("id, url, kind, is_primary, product_id, products(title_ru, sku)")
      .order("created_at", { ascending: false })
      .limit(120);
    if (err) setError(err.message);
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  async function remove(row: Row) {
    if (!confirm("Удалить файл из каталога?")) return;
    const supabase = createBrowserSupabase();
    const marker = "/storage/v1/object/public/product-media/";
    const idx = row.url.indexOf(marker);
    if (idx >= 0) {
      const path = decodeURIComponent(row.url.slice(idx + marker.length));
      await supabase.storage.from("product-media").remove([path]);
    }
    await supabase.from("product_media").delete().eq("id", row.id);
    await load();
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {rows.map((row) => {
          const product = Array.isArray(row.products) ? row.products[0] : row.products;
          return (
            <figure key={row.id} className="border border-silver/15 bg-black">
              {row.kind === "video" ? (
                <video src={row.url} className="aspect-square w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.url} alt="" className="aspect-square w-full object-cover" />
              )}
              <figcaption className="p-2 text-[10px] text-muted">
                <Link href={`/admin/products/${row.product_id}`} className="text-ivory hover:text-silver">
                  {product?.sku ?? "—"}
                </Link>
                <button type="button" className="ml-2 uppercase" onClick={() => remove(row)}>
                  удалить
                </button>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
