import { extract } from "@extractus/article-extractor";
import { YoutubeTranscript } from "youtube-transcript";

interface ExtractResult {
  text: string;
  title: string;
  source: "youtube" | "url";
}

function isYouTubeUrl(url: string): boolean {
  return (
    url.includes("youtube.com/watch") ||
    url.includes("youtu.be/") ||
    url.includes("youtube.com/shorts/")
  );
}

async function extractYouTube(url: string): Promise<ExtractResult> {
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  if (!transcript || transcript.length === 0) {
    throw new Error("No transcript available for this video.");
  }

  const text = transcript.map((t) => t.text).join(" ");

  // Extract video ID for title (simple approach)
  let title = "YouTube Video";
  const match = url.match(
    /(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) {
    title = `YouTube Video (${match[1]})`;
  }

  return { text, title, source: "youtube" };
}

async function extractArticle(url: string): Promise<ExtractResult> {
  const article = await extract(url);
  if (!article || !article.content) {
    throw new Error(
      "Could not extract content from this URL. Try pasting the text directly."
    );
  }

  // Strip HTML tags from content
  const text = article.content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    text,
    title: article.title || "Untitled Article",
    source: "url",
  };
}

export async function extractContent(url: string): Promise<ExtractResult> {
  if (isYouTubeUrl(url)) {
    return extractYouTube(url);
  }
  return extractArticle(url);
}
