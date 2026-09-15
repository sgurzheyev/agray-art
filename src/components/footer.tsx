import Link from "next/link";
import { BrandName } from "@/components/brand-name";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_TELEGRAM,
  CONTACT_TELEGRAM_HREF,
  SITE_DOMAIN,
  SITE_ORIGIN,
} from "@/lib/contacts";
import type { Category } from "@/lib/types";

const linkClass = "text-ivory/85 transition-colors hover:text-silver";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="relative z-10 mt-auto border-t border-silver/15 bg-ink/80 pb-20 backdrop-blur-md sm:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <BrandName as="p" className="text-2xl text-silver-bright" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Ювелирный дом. Ручная работа, свет на чёрном, зеркало металла. Москва · {SITE_DOMAIN}
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
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            <li>
              <a className={linkClass} href={CONTACT_TELEGRAM_HREF} target="_blank" rel="noreferrer">
                Telegram {CONTACT_TELEGRAM}
              </a>
            </li>
            <li>
              <a className={linkClass} href={`tel:${CONTACT_PHONE}`}>
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a className={linkClass} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a className={linkClass} href={SITE_ORIGIN}>
                {SITE_DOMAIN}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs tracking-widest text-muted/70 uppercase">
            © {new Date().getFullYear()} <BrandName tracking="0.16em" />
          </p>
        </div>
      </div>
    </footer>
  );
}
