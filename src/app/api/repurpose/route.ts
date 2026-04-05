import { auth, currentUser } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { ensureUser, getMonthlyUsage, saveRepurpose } from "@/lib/supabase";
import { PLANS, type ToneType } from "@/lib/constants";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return Response.json({ error: "No email found" }, { status: 400 });
  }

  const email = user.emailAddresses[0].emailAddress;
  const body = await request.json();
  const { text, tone = "professional", source, sourceUrl } = body;

  if (!text || typeof text !== "string" || text.trim().length < 50) {
    return Response.json(
      { error: "Please provide at least 50 characters of content." },
      { status: 400 }
    );
  }

  const validTones = ["professional", "casual", "witty", "educational"];
  if (!validTones.includes(tone)) {
    return Response.json({ error: "Invalid tone" }, { status: 400 });
  }

  // Check usage limits
  const dbUser = await ensureUser(userId, email);
  const plan = dbUser.plan as keyof typeof PLANS;
  const limit = PLANS[plan]?.monthlyLimit ?? PLANS.free.monthlyLimit;

  if (limit !== Infinity) {
    const usage = await getMonthlyUsage(userId);
    if (usage >= limit) {
      return Response.json(
        {
          error: `You've used all ${limit} free repurposes this month. Upgrade to Pro for unlimited.`,
          code: "LIMIT_REACHED",
        },
        { status: 429 }
      );
    }
  }

  // Stream response from Claude
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 4096,
    system: buildSystemPrompt(tone as ToneType),
    messages: [{ role: "user", content: buildUserPrompt(text) }],
  });

  const encoder = new TextEncoder();
  let fullContent = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullContent += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        // Save to database after streaming completes
        try {
          const outputs = JSON.parse(fullContent);
          await saveRepurpose({
            userId,
            inputText: text,
            inputSource: source || "text",
            sourceUrl,
            tone,
            outputs,
          });
        } catch {
          // JSON parse failed — still close the stream gracefully
          console.error("Failed to parse Claude output as JSON");
        }

        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
