"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { classNames } from "@/lib/format";
import { useCart } from "@/components/cart-provider";
import { InstallButton } from "@/components/install-prompt";
import type { Category, SiteButton } from "@/lib/types";

export function Header({
  navButtons,
  categories,
}: {
  navButtons: SiteButton[];
  categories: Category[];
}) {
  const pathname = usePathname();
  const { count, notice } = useCart();
  const [open, setOpen] = useState(false);
  const links = navButtons.length
    ? navButtons
    : [
        { key: "nav.catalog", label: "Каталог", href: "/catalog", visible: true, sortOrder: 10 },
        { key: "nav.atelier", label: "Ателье", href: "/atelier", visible: true, sortOrder: 20 },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <button
          type="button"
          className="flex size-10 items-center justify-center text-ivory md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <nav className="hidden items-center gap-8 text-[11px] tracking-[0.28em] uppercase text-muted md:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={classNames(
                "transition-colors hover:text-gold",
                pathname.startsWith(l.href) && l.href !== "/" && "text-gold",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="font-serif text-xl tracking-[0.35em] text-gold sm:text-2xl">A.GRAY</span>
        </Link>

        <div className="flex items-center gap-2">
          <InstallButton className="hidden items-center gap-1.5 border border-gold/30 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-gold transition hover:bg-gold/10 sm:flex" />
          <Link
            href="/cart"
            className="relative flex size-10 items-center justify-center text-ivory hover:text-gold"
            aria-label="Корзина"
          >
            <ShoppingBag className="size-5" strokeWidth={1.4} />
            {count > 0 && (
              <span className="absolute right-1 top-1 min-w-4 rounded-full bg-gold px-1 text-center font-sans text-[10px] font-semibold leading-4 text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/15 bg-ink px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4 text-sm tracking-[0.18em] uppercase text-ivory">
            {links.map((l) => (
              <Link key={l.key} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="text-muted"
                onClick={() => setOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <InstallButton className="mt-2 inline-flex items-center gap-2 text-gold" />
          </div>
        </div>
      )}

      {notice && (
        <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 border border-gold/40 bg-ink px-4 py-2 text-xs tracking-widest text-gold uppercase">
          {notice}
        </div>
      )}
    </header>
  );
}
