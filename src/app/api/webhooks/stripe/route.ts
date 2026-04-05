import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      // Determine plan from price
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price?.id;
      const plan =
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID
          ? "annual"
          : "pro";

      await supabase
        .from("users")
        .update({
          plan,
          stripe_customer_id: session.customer as string,
        })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      if (subscription.status === "active") {
        const priceId = subscription.items.data[0]?.price?.id;
        const plan =
          priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID
            ? "annual"
            : "pro";

        await supabase
          .from("users")
          .update({ plan })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from("users")
        .update({ plan: "free" })
        .eq("stripe_customer_id", customerId);

      break;
    }
  }

  return Response.json({ received: true });
}
