import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractContent } from "@/lib/extract";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const result = await extractContent(url);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not extract content from this URL. Try pasting the text directly.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
