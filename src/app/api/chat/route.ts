import { NextResponse } from "next/server";
import { products } from "@/lib/products";

const PERSONA = `Вы — консультант ювелирного дома A.GRAY (ателье Андрея, бренд A.GRAY, сайт agray.art).
Говорите по-русски, сдержанно, коротко, профессионально. Без восклицаний и скидочного тона.
Помогаете выбрать: кольца, браслеты, кресты, серьги, подвески, иконы, цепи, обручальные, линия SPORT.
Уточняете размер, металл (585 / 750 / 925), повод, бюджет.
Не выдумывайте наличие конкретного артикула, если его нет в переданном каталоге — предложите аналог или визит в ателье.
Цены называйте в рублях, только по каталогу.
Если вопрос не про украшения — мягко верните к теме.`;

function catalogDigest() {
  return products
    .map(
      (p) =>
        `${p.sku} | ${p.name} | ${p.category} | ${p.metal} ${p.assay} | ${p.weightGrams}г | ${p.price} RUB`,
    )
    .join("\n");
}

function demoReply(lastUser: string): string {
  const q = lastUser.toLowerCase();
  if (/размер|кольц|палец|обхват/.test(q)) {
    return "Размер кольца лучше снять в ателье или по внутренней окружности (мм). В карточке изделия есть ряд: 15–21. Если между размерами — берём больший и подгоняем. Для обручальной пары пишите оба размера в комментарии к заказу.";
  }
  if (/проб|585|750|серебр|металл|бел.*золот/.test(q)) {
    return "В витрине в основном золото 585; отдельные вещи — 750 (Cobra, Comfort). Белое золото — Solstice, Minimal, Stella, Box. Серебра 925 в этой выборке нет. Если нужен другой металл — это заказ в ателье, не сток.";
  }
  if (/крест|икон|православ|крестиль/.test(q)) {
    return "Нательные: крест Orthodox (AG-C-2041) и иконы Владимирская / Ангел-хранитель. Цепь лучше якорная 50–55 см (Anchor). Комплект «крест на цепи» — AG-C-2217. Цепь к иконе подбираем тоньше, чем к кресту.";
  }
  if (/свадьб|обруч|пар/.test(q)) {
    return "Обручальные: Classic 4 мм, Satin с дорожкой, Comfort 5 мм / 750. Цена указана за пару. Гравировка — в ателье после примерки. Comfort fit имеет смысл, если кольцо не снимают.";
  }
  if (/sport|спорт|каучук|зал|фитнес/.test(q)) {
    return "Линия SPORT: Pulse и Grip — каучук с золотой вставкой, размеры S/M/L. Track — печатка с чёрными гранями. Каучук меняется в ателье, золотая планка остаётся.";
  }
  if (/уход|полир|царап|чистить/.test(q)) {
    return "Ткань без абразива, тёплая вода, нейтральное мыло. Сатин и чёрное покрытие не трём пастой. Раз в сезон можно отдать на переполировку. Каучук SPORT — только протирка, не растворители.";
  }
  if (/цен|стоим|бюджет|сколько/.test(q)) {
    return "В этой выборке витрина примерно от 38 000 ₽ (крест Minimal) до 210 000 ₽ (цепь Bismarck). Кольца — около 98–186 тыс. Точная цифра в карточке изделия; вес цепи при другой длине пересчитывается.";
  }
  if (/доставк|самовывоз|москв/.test(q)) {
    return "Пока основной сценарий — самовывоз и визит в ателье в Москве. Службу доставки подключим вместе с боевым Stripe и доменом agray.art. Если вы не в городе — напишите в комментарии заказа, решим точечно.";
  }
  return "Могу помочь с размером, пробой, крестом/иконой, обручальной парой или SPORT. Назовите повод и бюджет — предложу 1–2 артикула из текущей витрины. Для индивидуальной работы лучше ателье.";
}

export async function POST(req: Request) {
  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
  );
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const apiKey = process.env.LLM_API_KEY;
  const base = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ reply: demoReply(lastUser), demo: true });
  }

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 500,
        messages: [
          { role: "system", content: `${PERSONA}\n\nКаталог v1:\n${catalogDigest()}` },
          ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("LLM error", res.status, text);
      return NextResponse.json({ reply: demoReply(lastUser), demo: true });
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({
      reply: reply || demoReply(lastUser),
      demo: false,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: demoReply(lastUser), demo: true });
  }
}
