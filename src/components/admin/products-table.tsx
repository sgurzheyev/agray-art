"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { formatPrice } from "@/lib/format";

type Row = {
  id: string;
  title_ru: string;
  sku: string;
  slug: string;
  price_cents: number;
  status: string;
  featured: boolean;
};

export function ProductsTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("products")
      .select("id, title_ru, sku, slug, price_cents, status, featured")
      .order("updated_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const list = rows.filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return `${r.title_ru} ${r.sku} ${r.slug}`.toLowerCase().includes(s);
  });

  async function patch(id: string, next: Partial<Row>) {
    setBusy(id);
    const supabase = createBrowserSupabase();
    await supabase.from("products").update(next).eq("id", id);
    await load();
    setBusy(null);
  }

  async function remove(id: string) {
    if (!confirm("Удалить изделие и его медиа?")) return;
    setBusy(id);
    const supabase = createBrowserSupabase();
    await supabase.from("products").delete().eq("id", id);
    await load();
    setBusy(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск"
          className="border border-gold/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-gold sm:w-64"
        />
        <Link href="/admin/products/new" className="bg-gold px-4 py-2 text-center text-xs tracking-[0.2em] text-ink uppercase">
          Создать
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="text-[10px] tracking-[0.2em] text-muted uppercase">
            <tr>
              <th className="py-2">Изделие</th>
              <th>Цена</th>
              <th>Статус</th>
              <th>Витрина</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {list.map((r) => (
              <tr key={r.id} className="text-ivory/90">
                <td className="py-3">
                  <Link href={`/admin/products/${r.id}`} className="hover:text-gold">
                    {r.title_ru}
                  </Link>
                  <p className="text-xs text-muted">{r.sku}</p>
                </td>
                <td>{formatPrice(Math.round(r.price_cents / 100))}</td>
                <td>
                  <select
                    value={r.status}
                    disabled={busy === r.id}
                    onChange={(e) => patch(r.id, { status: e.target.value })}
                    className="border border-gold/20 bg-ink px-2 py-1 text-xs"
                  >
                    <option value="published">опубл.</option>
                    <option value="draft">черновик</option>
                    <option value="hidden">скрыто</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={r.featured ? "text-gold" : "text-muted"}
                    onClick={() => patch(r.id, { featured: !r.featured })}
                  >
                    {r.featured ? "★" : "☆"}
                  </button>
                </td>
                <td className="text-right">
                  <button type="button" className="text-xs text-muted hover:text-gold" onClick={() => remove(r.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
