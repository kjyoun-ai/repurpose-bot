"use client";

import { useState } from "react";
import { Loader2, Sparkles, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TONES, type ToneType } from "@/lib/constants";

interface InputFormProps {
  onSubmit: (text: string, tone: ToneType) => Promise<void>;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [mode, setMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState<ToneType>("professional");
  const [extracting, setExtracting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "url" && url.trim()) {
      setExtracting(true);
      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(
            data.error || "Could not extract content from this URL"
          );
        }
        const data = await res.json();
        await onSubmit(data.text, tone);
      } catch (err) {
        // Let the parent handle the error via onSubmit rejection
        throw err;
      } finally {
        setExtracting(false);
      }
      return;
    }

    if (text.trim().length < 50) return;
    await onSubmit(text.trim(), tone);
  }

  const busy = isLoading || extracting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("text")}
        >
          Paste Text
        </Button>
        <Button
          type="button"
          variant={mode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("url")}
        >
          <LinkIcon className="h-4 w-4 mr-1" />
          From URL
        </Button>
      </div>

      {mode === "text" ? (
        <Textarea
          placeholder="Paste your blog post, article, or any text content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="resize-y"
          disabled={busy}
        />
      ) : (
        <Input
          type="url"
          placeholder="https://yourblog.com/post or https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={busy}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <Select
          value={tone}
          onValueChange={(v) => setTone(v as ToneType)}
          disabled={busy}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tone" />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" disabled={busy} size="lg">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {extracting ? "Extracting..." : "Generating..."}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Repurpose
            </>
          )}
        </Button>
      </div>

      {mode === "text" && text.length > 0 && text.length < 50 && (
        <p className="text-xs text-muted-foreground">
          Please write at least 50 characters ({50 - text.length} more needed)
        </p>
      )}
    </form>
  );
}
