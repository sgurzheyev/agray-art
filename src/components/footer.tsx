import Link from "next/link";
import type { Category } from "@/lib/types";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="relative z-10 mt-auto border-t border-silver/15 bg-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl tracking-[0.3em] text-silver-bright">A.GRAY</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Ювелирный дом. Ручная работа, свет на чёрном, зеркало металла. Москва · agray.art
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Каталог</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-ivory/80">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalog/${c.slug}`} className="hover:text-silver">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Ателье</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Примерка, размер, гравировка, заказ по эскизу.
            <br />
            Telegram и почта — в README до подключения домена.
          </p>
          <p className="mt-6 text-xs tracking-widest text-muted/70 uppercase">
            © {new Date().getFullYear()} A.GRAY
          </p>
        </div>
      </div>
    </footer>
  );
}
