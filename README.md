# A.GRAY — agray.art

Ювелирный PWA дома **A.GRAY** (мастер Андрей): чёрный фон, золото, русский интерфейс, установка в Chrome.

Домен `agray.art` подключается позже (DNS → хостинг). Пока достаточно `localhost` или любого preview-URL.

## Стек

Next.js App Router · TypeScript · Tailwind CSS v4 · Stripe Checkout · OpenAI-compatible LLM

## Локальный запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

`npm run generate:media` пересобирает PNG-иконки и SVG-плейсхолдеры изделий.

## Переменные окружения

См. `.env.example`.

| Переменная | Назначение |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Канонический URL (success/cancel Stripe, OG). Для локалки — `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Секретный ключ. Тест: `sk_test_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Публичный ключ. Тест: `pk_test_…` (зарезервирован под Elements / будущий встроенный виджет) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` для `/api/stripe/webhook` |
| `LLM_API_KEY` | Ключ LLM. Пусто = демо-ответы консультанта |
| `LLM_BASE_URL` | OpenAI-совместимый endpoint, по умолчанию `https://api.openai.com/v1` |
| `LLM_MODEL` | Модель, по умолчанию `gpt-4o-mini` |

Не коммитьте `.env.local`.

## Stripe (test → live)

1. Кабинет: [test API keys](https://dashboard.stripe.com/test/apikeys).
2. Вставьте `sk_test_` в `STRIPE_SECRET_KEY`.
3. Checkout создаётся в `/api/checkout`; цены берутся **с сервера** из каталога, не с клиента.
4. Без ключа кнопка «Оплатить» открывает демо-успех, деньги не списываются.
5. Для боя: `sk_live_` / `pk_live_`, webhook endpoint `https://agray.art/api/stripe/webhook`, валюта уже `rub`.
6. Включите RUB в Stripe Dashboard, если ещё не включена.

## AI-консультант

Плавающая кнопка **«Спросить A.GRAY»**. Персона — сдержанный консультант ателье (размеры, проба, кресты/иконы, обручальные, SPORT).

- Нет `LLM_API_KEY` → демо-режим (ключевые сценарии на русском).
- Есть ключ → `POST {LLM_BASE_URL}/chat/completions`. Подойдёт OpenAI, совместимый прокси или другой провайдер с тем же API.

## PWA (Chrome)

1. `npm run build && npm start` или HTTPS-хостинг (на `localhost` тоже ставится).
2. Chrome → иконка установки в адресной строке **или** кнопка «Установить» в шапке (событие `beforeinstallprompt`).
3. Манифест: `/manifest.webmanifest`. Иконки золото на чёрном: `public/icons/`.
4. Service worker: `public/sw.js` (кэш витрины, API не кэшируется).

## Медиа и Telegram (~7k фото)

Плейсхолдеры лежат так:

```
public/media/products/{SKU}/01.svg
public/media/products/{SKU}/02.svg
public/media/products/{SKU}/proof.mp4   # видеодоказательство, опционально
public/media/hero/atelier.mp4           # muted loop для героя, опционально
public/media/hero/poster.svg
public/media/import/telegram/           # сюда — выгрузка из Telegram
```

Импорт не меняет URL карточек: достаточно заменить `01.svg` на `01.jpg` (и обновить пути в `src/lib/products.ts`) либо класть jpg рядом и переключить `productImage()`.

Видеослоты на главной и в карточке сами подхватывают файл, если он появился.

## DNS для agray.art (позже)

1. Задеплоить (Vercel / свой Node).
2. `A` / `CNAME` / `AAAA` на хостинг.
3. `NEXT_PUBLIC_SITE_URL=https://agray.art`.
4. Обновить Stripe success/cancel и webhook.
5. HTTPS обязателен для установки PWA с телефона.

## TODO (не в v1)

- Конфигуратор: камень / литера / гравировка с пересчётом цены
- 3D / GLB viewer на карточке изделия
- Синхронизация каталога и фото из Telegram (~7k)
- Боевые ключи Stripe + чеки / 54-ФЗ при необходимости
- Карты, самовывоз, слоты примерки
- Админка артикулов

## Маршруты

| Путь | Содержание |
| --- | --- |
| `/` | Герой, категории, избранное, CTA ателье |
| `/catalog`, `/catalog/[category]` | Витрина |
| `/product/[slug]` | Галерея с zoom, спецификация, Купить, видеослот |
| `/cart`, `/checkout` | Корзина и Stripe |
| `/atelier` | Мастерская |
| `/api/chat` | Консультант |
| `/api/checkout` | Stripe session |
