import { createClient } from "@supabase/supabase-js";

// Server-side client with service role key (for API routes)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key);
}

// Ensure user exists in our database (upsert from Clerk)
export async function ensureUser(
  userId: string,
  email: string
): Promise<{ plan: string; stripe_customer_id: string | null }> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("users")
    .select("plan, stripe_customer_id")
    .eq("id", userId)
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("users")
    .insert({ id: userId, email, plan: "free" })
    .select("plan, stripe_customer_id")
    .single();

  if (error) throw error;
  return data;
}

// Get monthly usage count
export async function getMonthlyUsage(userId: string): Promise<number> {
  const supabase = createServiceClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("repurposes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if (error) throw error;
  return count || 0;
}

// Save a repurpose result
export async function saveRepurpose(params: {
  userId: string;
  inputText: string;
  inputSource: string;
  sourceUrl?: string;
  tone: string;
  outputs: Record<string, string>;
}) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("repurposes").insert({
    user_id: params.userId,
    input_text: params.inputText.slice(0, 10000),
    input_source: params.inputSource,
    source_url: params.sourceUrl || null,
    tone: params.tone,
    outputs: params.outputs,
  });

  if (error) throw error;
}
