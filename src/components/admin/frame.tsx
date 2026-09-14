import Link from "next/link";
import { BrandName } from "@/components/brand-name";
import { signOutAdmin } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/products", label: "Изделия" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/buttons", label: "Кнопки" },
  { href: "/admin/media", label: "Медиа" },
];

export function AdminFrame({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <aside className="flex w-52 shrink-0 flex-col border-r border-silver/20 bg-ink-soft px-4 py-6">
        <Link href="/admin" className="text-silver">
          <BrandName className="text-xl" />
        </Link>
        <p className="mt-1 text-[10px] tracking-[0.2em] text-muted uppercase">Админка</p>
        <nav className="mt-8 flex flex-col gap-3 text-[11px] tracking-[0.18em] uppercase">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ivory/80 hover:text-silver">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pt-8 text-xs text-muted">
          <p className="break-all">{email}</p>
          <form action={signOutAdmin}>
            <button type="submit" className="text-silver uppercase tracking-widest">
              Выйти
            </button>
          </form>
          <Link href="/" className="block hover:text-silver">
            На сайт
          </Link>
        </div>
      </aside>
      <div className="flex-1 overflow-auto px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
