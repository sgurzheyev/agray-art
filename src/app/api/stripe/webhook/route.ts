import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ received: true, demo: true });
  }

  const stripe = new Stripe(key);
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    if (event.type === "checkout.session.completed") {
      console.info("checkout.session.completed", event.id);
    }
    return NextResponse.json({ received: true, type: event.type });
  } catch (err) {
    const message = err instanceof Error ? err.message : "webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
