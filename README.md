# A.GRAY — agray.art

Ювелирный PWA дома **A.GRAY**: чёрный фон, серебряное зеркало / liquid glass, русский интерфейс, установка в Chrome, админка на Supabase.

Домен `agray.art` подключается позже (DNS → хостинг). Пока достаточно `localhost` или любого preview-URL.

## Стек

Next.js App Router · TypeScript · Tailwind CSS v4 · Stripe Checkout · OpenAI-compatible LLM · Supabase (Postgres, Auth, Storage)

Проект Supabase: **agray.art** · `https://sgtkslipwvxmqcalfpvn.supabase.co` · eu-west-1 · org **gray.art** (отдельный аккаунт, другие проекты не использовать).

## Локальный запуск

```bash
npm install
cp .env.example .env.local
# заполните ключи Supabase / Stripe / LLM по желанию
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Без ключей Supabase витрина идёт с локального seed.

```bash
npm run build
npm start
```

`npm run generate:media` — PNG-иконки и SVG-плейсхолдеры.  
`npm run db:generate-seed` — пересобрать `supabase/seed.sql` из каталога в коде.

## Переменные окружения

См. `.env.example`. Секреты **никогда не коммитить** и не вшивать в код.

| Переменная | Назначение |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Канонический абсолютный URL (Stripe, OG). Пустое значение на Vercel не ломает build: берётся `VERCEL_URL` или `https://agray.art`. Локально можно `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sgtkslipwvxmqcalfpvn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key из Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (только сервер: заказы). Не отдавать в браузер |
| `STRIPE_SECRET_KEY` | Тест: `sk_test_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Тест: `pk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` для `/api/stripe/webhook` |
| `LLM_API_KEY` | Ключ LLM. Пусто = демо-ответы консультанта |
| `LLM_BASE_URL` | По умолчанию `https://api.openai.com/v1` |
| `LLM_MODEL` | По умолчанию `gpt-4o-mini` |

Ключи: [Supabase API](https://supabase.com/dashboard/project/sgtkslipwvxmqcalfpvn/settings/api) · [Stripe test keys](https://dashboard.stripe.com/test/apikeys).

## Supabase: схема, seed, админ

1. Откройте [SQL editor](https://supabase.com/dashboard/project/sgtkslipwvxmqcalfpvn/sql) проекта **agray.art**.
2. Вставьте и выполните `supabase/migrations/001_schema.sql` — таблицы, RLS, bucket `product-media`.
3. Затем `supabase/seed.sql` — категории, крошечный fallback-каталог, кнопки шапки/главной.
   Боевая витрина (~35 студийных кадров) живёт в Supabase `products` + bucket `product-media`, не в git.
4. Authentication → Users → **Add user** → email + пароль (например `andrey@agray.art`). Скопируйте UUID.
5. Выполните (подставьте UUID и email):

```sql
insert into public.admin_users (user_id, email)
values ('UUID-ИЗ-AUTH', 'andrey@agray.art');
```

Шаблон: `supabase/003_first_admin.sql`.

6. В `.env.local` пропишите URL + anon key (+ service_role по желанию).
7. `npm run dev` → [http://localhost:3000/admin](http://localhost:3000/admin).

RLS: гости читают только `published` изделия и видимые категории/кнопки. Пишет только строка в `admin_users`. Bucket `product-media`: публичное чтение, запись у админа.

## Админка `/admin`

Русский UI, чёрное и серебряное стекло. После входа:

- **Обзор** — счётчики и последние изделия
- **Изделия** — создать / цена / статус / витрина / удалить; в карточке — фото, видеодоказательство, опубликовать/скрыть
- **Категории** — название, порядок, скрыть
- **Кнопки** — подписи и ссылки шапки и главной, показать/скрыть
- **Медиатека** — все файлы, удаление

Andrey меняет цену, фото и кнопку без деплоя: витрина читает Supabase (`force-dynamic`).

## Stripe (test → live)

1. [test API keys](https://dashboard.stripe.com/test/apikeys) → `STRIPE_SECRET_KEY`.
2. `/api/checkout` берёт цены **с сервера** (Supabase или локальный seed).
3. Без ключа — демо-успех. При наличии Supabase service role пишется stub в `orders`.
4. Бой: `sk_live_` / `pk_live_`, webhook `https://agray.art/api/stripe/webhook`, валюта `rub`.

## AI-консультант

Плавающая **«Спросить A.GRAY»**. Каталог в промпт подставляется актуальный (из БД, если настроена).

## PWA (Chrome)

1. `npm run build && npm start` или HTTPS.
2. Установка: иконка в адресной строке или «Установить» в шапке.
3. Манифест `/manifest.webmanifest`, SW `public/sw.js`.

## Медиа и Telegram (~7k фото)

Плейсхолдеры и слоты под студийные кадры:

```
public/media/products/{SKU}/01.svg
public/products/{category}/
public/media/hero/atelier.mp4
public/media/import/telegram/
```

После seed URL в `product_media` указывают на эти SVG. Новые фото Андрей грузит в Storage `product-media` из админки — витрина переключается на публичный URL.

## DNS для agray.art (позже)

1. Деплой (Vercel / Node).
2. DNS на хостинг, `NEXT_PUBLIC_SITE_URL=https://agray.art`.
3. Authentication → URL Configuration: Site URL и Redirect `https://agray.art/admin`.
4. Stripe success/cancel и webhook.
5. HTTPS для PWA на телефоне.

## TODO

- Конфигуратор камня / литеры / гравировки
- 3D / GLB viewer
- Синхронизация ~7k фото из Telegram в `product-media`
- Боевой Stripe + 54-ФЗ
- Слоты примерки

## Маршруты

| Путь | Содержание |
| --- | --- |
| `/` | Герой, категории, избранное, CTA (кнопки из `site_settings`) |
| `/catalog`, `/catalog/[category]` | Витрина из Supabase или seed |
| `/product/[slug]` | Карточка, zoom, видео, Купить |
| `/cart`, `/checkout` | Корзина и Stripe |
| `/atelier` | Мастерская |
| `/admin` | Админка |
| `/api/chat` | Консультант |
| `/api/checkout` | Stripe session + stub заказа |
