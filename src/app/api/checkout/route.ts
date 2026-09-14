import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/products";

type IncomingItem = { slug: string; qty: number; size?: string };
type Customer = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  notes?: string;
};

export async function POST(req: Request) {
  let body: { items?: IncomingItem[]; customer?: Customer };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const raw = body.items ?? [];
  const line = raw
    .map((item) => {
      const product = getProduct(item.slug);
      if (!product || item.qty < 1) return null;
      return { product, qty: Math.min(10, Math.floor(item.qty)), size: item.size };
    })
    .filter(Boolean) as { product: NonNullable<ReturnType<typeof getProduct>>; qty: number; size?: string }[];

  if (line.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({
      url: `${origin}/checkout/success?demo=1`,
      demo: true,
    });
  }

  const stripe = new Stripe(secret);
  const customer = body.customer ?? {};

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ru",
      customer_email: customer.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      line_items: line.map(({ product, qty, size }) => ({
        quantity: qty,
        price_data: {
          currency: "rub",
          unit_amount: product.price * 100,
          product_data: {
            name: size ? `${product.name} · ${size}` : product.name,
            description: `${product.sku} · ${product.metal} ${product.assay}`,
          },
        },
      })),
      metadata: {
        name: customer.name ?? "",
        phone: customer.phone ?? "",
        city: customer.city ?? "",
        notes: (customer.notes ?? "").slice(0, 400),
        skus: line.map((l) => l.product.sku).join(","),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe не вернул URL" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url, demo: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
