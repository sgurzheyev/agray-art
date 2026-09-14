"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Row = {
  id: string;
  key: string;
  label_ru: string;
  href: string;
  visible: boolean;
  sort_order: number;
  meta: Record<string, unknown>;
};

export function ButtonsEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data, error: err } = await supabase.from("site_settings").select("*").order("sort_order");
    if (err) setError(err.message);
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  function patch(id: string, next: Partial<Row>) {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, ...next } : r)));
  }

  async function save(row: Row) {
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase
      .from("site_settings")
      .update({
        label_ru: row.label_ru,
        href: row.href,
        visible: row.visible,
        sort_order: row.sort_order,
        key: row.key,
      })
      .eq("id", row.id);
    if (err) setError(err.message);
    else await load();
  }

  async function add() {
    const key = prompt("Ключ, например nav.custom или home.banner");
    if (!key) return;
    const supabase = createBrowserSupabase();
    const group = key.split(".")[0] ?? "nav";
    const { error: err } = await supabase.from("site_settings").insert({
      key,
      label_ru: "Новая кнопка",
      href: "/",
      visible: true,
      sort_order: rows.length * 10 + 10,
      meta: { group },
    });
    if (err) setError(err.message);
    else await load();
  }

  async function remove(id: string) {
    if (!confirm("Убрать кнопку?")) return;
    const supabase = createBrowserSupabase();
    await supabase.from("site_settings").delete().eq("id", id);
    await load();
  }

  const groups = [
    { id: "nav", title: "Шапка" },
    { id: "home", title: "Главная" },
    { id: "other", title: "Прочие" },
  ];

  function inGroup(row: Row, group: string) {
    const g = (row.meta?.group as string) || row.key.split(".")[0];
    if (group === "other") return g !== "nav" && g !== "home";
    return g === group;
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <button type="button" onClick={add} className="mb-6 border border-silver px-4 py-2 text-xs tracking-[0.2em] text-silver uppercase">
        Добавить кнопку
      </button>
      {groups.map((g) => {
        const list = rows.filter((r) => inGroup(r, g.id));
        if (!list.length && g.id === "other") return null;
        return (
          <section key={g.id} className="mb-10">
            <h2 className="font-serif text-2xl text-ivory">{g.title}</h2>
            <ul className="mt-4 space-y-3">
              {list.map((row) => (
                <li key={row.id} className="grid gap-2 border border-silver/20 p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                  <input
                    value={row.label_ru}
                    onChange={(e) => patch(row.id, { label_ru: e.target.value })}
                    className="border border-silver/15 bg-transparent px-2 py-1 text-sm"
                  />
                  <input
                    value={row.href}
                    onChange={(e) => patch(row.id, { href: e.target.value })}
                    className="border border-silver/15 bg-transparent px-2 py-1 text-sm"
                  />
                  <label className="flex items-center gap-1 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={row.visible}
                      onChange={(e) => patch(row.id, { visible: e.target.checked })}
                    />
                    видна
                  </label>
                  <div className="flex gap-2">
                    <button type="button" className="text-xs text-silver uppercase" onClick={() => save(row)}>
                      Сохранить
                    </button>
                    <button type="button" className="text-xs text-muted" onClick={() => remove(row.id)}>
                      ×
                    </button>
                  </div>
                  <p className="text-[10px] tracking-widest text-muted uppercase sm:col-span-4">{row.key}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
