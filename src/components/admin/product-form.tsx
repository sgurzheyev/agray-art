"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type CategoryOpt = { id: string; slug: string; name_ru: string };
type MediaRow = {
  id: string;
  kind: "photo" | "video";
  url: string;
  sort_order: number;
  is_primary: boolean;
};

type FormState = {
  title_ru: string;
  slug: string;
  sku: string;
  category_id: string;
  description_ru: string;
  price_rub: string;
  metal: string;
  assay: string;
  weight_g: string;
  size_label: string;
  sizes: string;
  stone: string;
  lead_days: string;
  status: "draft" | "published" | "hidden";
  featured: boolean;
};

const empty: FormState = {
  title_ru: "",
  slug: "",
  sku: "",
  category_id: "",
  description_ru: "",
  price_rub: "",
  metal: "Золото жёлтое",
  assay: "585",
  weight_g: "0",
  size_label: "Размер",
  sizes: "",
  stone: "",
  lead_days: "14",
  status: "draft",
  featured: false,
};

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [cats, setCats] = useState<CategoryOpt[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    const t = window.setTimeout(() => {
      void supabase
        .from("categories")
        .select("id, slug, name_ru")
        .order("sort_order")
        .then(({ data }) => {
          const list = (data as CategoryOpt[]) ?? [];
          setCats(list);
          setForm((f) => (f.category_id || !list[0] ? f : { ...f, category_id: list[0].id }));
        });
      if (!productId) return;
      void (async () => {
        const { data } = await supabase
          .from("products")
          .select("*, product_media(*)")
          .eq("id", productId)
          .single();
        if (!data) return;
        const sizes = Array.isArray(data.sizes) ? data.sizes.join(", ") : "";
        setForm({
          title_ru: data.title_ru,
          slug: data.slug,
          sku: data.sku,
          category_id: data.category_id,
          description_ru: data.description_ru,
          price_rub: String(Math.round(Number(data.price_cents) / 100)),
          metal: data.metal,
          assay: data.assay,
          weight_g: String(data.weight_g),
          size_label: data.size_label ?? "",
          sizes,
          stone: data.stone ?? "",
          lead_days: String(data.lead_days),
          status: data.status,
          featured: data.featured,
        });
        const m = [...((data.product_media as MediaRow[]) ?? [])].sort((a, b) => a.sort_order - b.sort_order);
        setMedia(m);
      })();
    }, 0);
    return () => window.clearTimeout(t);
  }, [productId]);

  function payload() {
    const sizes = form.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      title_ru: form.title_ru.trim(),
      slug: form.slug.trim(),
      sku: form.sku.trim(),
      category_id: form.category_id,
      description_ru: form.description_ru.trim(),
      price_cents: Math.round(Number(form.price_rub || 0) * 100),
      currency: "RUB",
      metal: form.metal.trim(),
      assay: form.assay.trim(),
      weight_g: Number(form.weight_g || 0),
      size_label: form.size_label.trim() || null,
      sizes,
      stone: form.stone.trim() || null,
      lead_days: Number(form.lead_days || 14),
      status: form.status,
      featured: form.featured,
    };
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createBrowserSupabase();
    if (productId) {
      const { error: err } = await supabase.from("products").update(payload()).eq("id", productId);
      setBusy(false);
      if (err) setError(err.message);
      else router.refresh();
      return;
    }
    const { data, error: err } = await supabase.from("products").insert(payload()).select("id").single();
    setBusy(false);
    if (err || !data) {
      setError(err?.message ?? "Не удалось создать");
      return;
    }
    router.push(`/admin/products/${data.id}`);
  }

  async function reloadMedia(id: string) {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("product_media")
      .select("*")
      .eq("product_id", id)
      .order("sort_order");
    setMedia((data as MediaRow[]) ?? []);
  }

  async function upload(files: FileList | null, kind: "photo" | "video") {
    if (!productId || !files?.length) return;
    setBusy(true);
    const supabase = createBrowserSupabase();
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      const { data } = supabase.storage.from("product-media").getPublicUrl(path);
      const nextOrder = (media[media.length - 1]?.sort_order ?? 0) + 1;
      await supabase.from("product_media").insert({
        product_id: productId,
        kind,
        url: data.publicUrl,
        sort_order: nextOrder,
        is_primary: media.length === 0 && kind === "photo",
      });
    }
    await reloadMedia(productId);
    setBusy(false);
  }

  async function setPrimary(id: string) {
    if (!productId) return;
    const supabase = createBrowserSupabase();
    await supabase.from("product_media").update({ is_primary: false }).eq("product_id", productId);
    await supabase.from("product_media").update({ is_primary: true }).eq("id", id);
    await reloadMedia(productId);
  }

  async function removeMedia(row: MediaRow) {
    if (!productId) return;
    const supabase = createBrowserSupabase();
    const marker = "/storage/v1/object/public/product-media/";
    const idx = row.url.indexOf(marker);
    if (idx >= 0) {
      const path = decodeURIComponent(row.url.slice(idx + marker.length));
      await supabase.storage.from("product-media").remove([path]);
    }
    await supabase.from("product_media").delete().eq("id", row.id);
    await reloadMedia(productId);
  }

  function field(key: keyof FormState, label: string, type = "text") {
    return (
      <label className="block">
        <span className="text-[11px] tracking-[0.18em] text-silver uppercase">{label}</span>
        <input
          type={type}
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 w-full border border-silver/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-silver"
        />
      </label>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-3">
        {field("title_ru", "Название")}
        <div className="grid gap-3 sm:grid-cols-2">
          {field("slug", "Slug")}
          {field("sku", "Артикул")}
        </div>
        <label className="block">
          <span className="text-[11px] tracking-[0.18em] text-silver uppercase">Категория</span>
          <select
            value={form.category_id}
            onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
            className="mt-1 w-full border border-silver/20 bg-ink px-3 py-2 text-sm"
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_ru}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] tracking-[0.18em] text-silver uppercase">Описание</span>
          <textarea
            rows={6}
            value={form.description_ru}
            onChange={(e) => setForm((f) => ({ ...f, description_ru: e.target.value }))}
            className="mt-1 w-full border border-silver/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-silver"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {field("price_rub", "Цена, ₽", "number")}
          {field("weight_g", "Вес, г", "number")}
          {field("metal", "Металл")}
          {field("assay", "Проба")}
          {field("size_label", "Подпись размера")}
          {field("sizes", "Размеры через запятую")}
          {field("stone", "Вставка")}
          {field("lead_days", "Срок, дни", "number")}
        </div>
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="text-[11px] tracking-[0.18em] text-silver uppercase">Статус</span>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as FormState["status"] }))}
            className="mt-1 w-full border border-silver/20 bg-ink px-3 py-2 text-sm"
          >
            <option value="published">Опубликовано</option>
            <option value="draft">Черновик</option>
            <option value="hidden">Скрыто</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          В блоке «Витрина»
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn-glass w-full py-3 text-xs tracking-[0.24em] disabled:opacity-60"
        >
          {productId ? "Сохранить" : "Создать"}
        </button>
        {productId && (
          <div className="border border-silver/20 p-4">
            <p className="text-[11px] tracking-[0.18em] text-silver uppercase">Фото и видео</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {media.map((m) => (
                <div key={m.id} className="relative bg-black">
                  {m.kind === "video" ? (
                    <video src={m.url} className="aspect-square w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="aspect-square w-full object-cover" />
                  )}
                  <div className="flex justify-between gap-1 p-1 text-[10px]">
                    <button type="button" className="text-silver" onClick={() => setPrimary(m.id)}>
                      {m.is_primary ? "главное" : "в главные"}
                    </button>
                    <button type="button" className="text-muted" onClick={() => removeMedia(m)}>
                      удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <label className="mt-3 block text-xs text-muted">
              Фото
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 block w-full text-xs"
                onChange={(e) => upload(e.target.files, "photo")}
              />
            </label>
            <label className="mt-3 block text-xs text-muted">
              Видеодоказательство
              <input
                type="file"
                accept="video/*"
                className="mt-1 block w-full text-xs"
                onChange={(e) => upload(e.target.files, "video")}
              />
            </label>
          </div>
        )}
      </div>
    </form>
  );
}
