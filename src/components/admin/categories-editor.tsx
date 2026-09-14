"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Row = {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string;
  blurb_ru: string;
  sort_order: number;
  visible: boolean;
};

export function CategoriesEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data, error: err } = await supabase.from("categories").select("*").order("sort_order");
    if (err) setError(err.message);
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  async function save(row: Row) {
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase
      .from("categories")
      .update({
        name_ru: row.name_ru,
        name_en: row.name_en,
        blurb_ru: row.blurb_ru,
        sort_order: row.sort_order,
        visible: row.visible,
        slug: row.slug,
      })
      .eq("id", row.id);
    if (err) setError(err.message);
    else await load();
  }

  async function add() {
    const slug = prompt("slug (латиница, например charms)");
    if (!slug) return;
    const supabase = createBrowserSupabase();
    const max = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
    const { error: err } = await supabase.from("categories").insert({
      slug,
      name_ru: slug,
      name_en: slug,
      blurb_ru: "",
      sort_order: max + 1,
      visible: true,
    });
    if (err) setError(err.message);
    else await load();
  }

  async function move(index: number, dir: -1 | 1) {
    const other = index + dir;
    if (other < 0 || other >= rows.length) return;
    const a = rows[index];
    const b = rows[other];
    const supabase = createBrowserSupabase();
    await supabase.from("categories").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", b.id);
    await load();
  }

  function patch(id: string, next: Partial<Row>) {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, ...next } : r)));
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <button type="button" onClick={add} className="mb-6 border border-silver px-4 py-2 text-xs tracking-[0.2em] text-silver uppercase">
        Добавить категорию
      </button>
      <ul className="space-y-6">
        {rows.map((row, i) => (
          <li key={row.id} className="border border-silver/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="text-silver" onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" className="text-silver" onClick={() => move(i, 1)}>
                ↓
              </button>
              <input
                value={row.name_ru}
                onChange={(e) => patch(row.id, { name_ru: e.target.value })}
                className="flex-1 border border-silver/20 bg-transparent px-2 py-1 font-serif text-xl outline-none"
              />
              <label className="text-xs text-muted">
                <input
                  type="checkbox"
                  checked={row.visible}
                  onChange={(e) => patch(row.id, { visible: e.target.checked })}
                  className="mr-1"
                />
                видна
              </label>
              <button type="button" className="text-xs tracking-widest text-silver uppercase" onClick={() => save(row)}>
                Сохранить
              </button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <input
                value={row.slug}
                onChange={(e) => patch(row.id, { slug: e.target.value })}
                className="border border-silver/15 bg-transparent px-2 py-1 text-xs"
              />
              <input
                value={row.name_en}
                onChange={(e) => patch(row.id, { name_en: e.target.value })}
                className="border border-silver/15 bg-transparent px-2 py-1 text-xs"
              />
              <input
                value={row.blurb_ru}
                onChange={(e) => patch(row.id, { blurb_ru: e.target.value })}
                className="border border-silver/15 bg-transparent px-2 py-1 text-xs sm:col-span-1"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
