import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ivory">Нет такой страницы</h1>
      <Link href="/catalog" className="mt-8 inline-block text-xs tracking-[0.28em] text-gold uppercase">
        В каталог
      </Link>
    </div>
  );
}
