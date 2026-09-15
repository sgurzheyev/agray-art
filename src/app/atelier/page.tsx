import type { Metadata } from "next";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_TELEGRAM,
  CONTACT_TELEGRAM_HREF,
} from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Ателье",
  description: "Мастерская A.GRAY — примерка, размер, гравировка, заказ по эскизу.",
};

export default function AtelierPage() {
  return (
    <div>
      <section className="relative min-h-[50dvh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/atelier/workbench.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative mx-auto flex min-h-[50dvh] max-w-6xl flex-col justify-end px-4 pb-12 sm:px-6">
          <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Workshop</p>
          <h1 className="mt-2 font-serif text-5xl text-ivory">Ателье Андрея</h1>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="space-y-5 text-sm leading-relaxed text-muted">
          <p>
            Дом A.GRAY — это не витрина с бесконечным стоком. Каждое изделие проходит воск, отливку,
            закрепку и полировку. Если нужен размер «между», другая длина цепи или буква на подвеске —
            это делается здесь, а не «в комментарии к заказу».
          </p>
          <p>
            На сайте — выборка v1 и слоты под фото/видео. Полный архив (~7k кадров из Telegram) будет
            наложен на артикулы отдельным импортом, без смены маршрутов.
          </p>
          <p>
            Конфигуратор камня и 3D/GLB-просмотр — в TODO. Пока консультант в чате «Спросить A.GRAY»
            и эта страница.
          </p>
        </div>
        <div className="border border-silver/20 p-8">
          <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Визит</p>
          <ul className="mt-6 space-y-4 text-sm text-ivory/85">
            <li>Примерка колец и обручальных пар</li>
            <li>Подбор цепи к кресту и иконе</li>
            <li>Гравировка, реставрация, переполировка</li>
            <li>Линия SPORT — замена каучука</li>
            <li>
              Telegram{" "}
              <a className="text-silver hover:text-silver-bright" href={CONTACT_TELEGRAM_HREF} target="_blank" rel="noreferrer">
                {CONTACT_TELEGRAM}
              </a>
            </li>
            <li>
              <a className="text-silver hover:text-silver-bright" href={`tel:${CONTACT_PHONE}`}>
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a className="text-silver hover:text-silver-bright" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <Link
            href="/catalog"
            className="btn-glass mt-8 px-6 py-3 text-xs tracking-[0.28em]"
          >
            К коллекции
          </Link>
        </div>
      </div>
    </div>
  );
}
