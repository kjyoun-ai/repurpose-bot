import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("repurposes")
    .select("id, input_text, input_source, tone, outputs, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return Response.json({ error: "Failed to load history" }, { status: 500 });
  }

  return Response.json({ entries: data });
}
