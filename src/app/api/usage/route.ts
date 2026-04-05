import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureUser, getMonthlyUsage } from "@/lib/supabase";
import { PLANS } from "@/lib/constants";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    return Response.json({ error: "No email" }, { status: 400 });
  }

  const dbUser = await ensureUser(userId, email);
  const plan = dbUser.plan as keyof typeof PLANS;
  const limit = PLANS[plan]?.monthlyLimit ?? PLANS.free.monthlyLimit;
  const usage = await getMonthlyUsage(userId);

  return Response.json({
    usage,
    limit: limit === Infinity ? -1 : limit,
    plan: dbUser.plan,
  });
}
