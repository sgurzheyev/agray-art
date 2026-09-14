import type { Metadata } from "next";
import Link from "next/link";
import { BrandName } from "@/components/brand-name";

export const metadata: Metadata = { title: "Офлайн" };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <BrandName as="p" className="text-4xl text-silver" tracking="0.16em" />
      <p className="mt-6 text-sm text-muted">Нет сети. Откройте сохранённые страницы или попробуйте снова.</p>
      <Link href="/" className="mt-8 inline-block text-xs tracking-[0.28em] text-silver uppercase">
        На главную
      </Link>
    </div>
  );
}
