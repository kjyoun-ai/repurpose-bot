"use client";

import { useState, useCallback } from "react";
import { InputForm } from "@/components/dashboard/input-form";
import { OutputTabs } from "@/components/dashboard/output-tabs";
import { UsageBadge } from "@/components/dashboard/usage-badge";
import { Loader2 } from "lucide-react";
import type { ToneType, PlatformKey } from "@/lib/constants";

export type RepurposeOutputs = Partial<Record<PlatformKey, string>>;

export default function DashboardPage() {
  const [outputs, setOutputs] = useState<RepurposeOutputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (text: string, tone: ToneType) => {
    setIsLoading(true);
    setError(null);
    setOutputs(null);
    setStreamText("");

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreamText(accumulated);

        // Try to parse as complete JSON for progressive display
        try {
          const parsed = JSON.parse(accumulated);
          setOutputs(parsed);
        } catch {
          // Not complete JSON yet — show raw stream
        }
      }

      // Final parse
      try {
        const final = JSON.parse(accumulated);
        setOutputs(final);
      } catch {
        setError("Failed to parse the generated content. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Repurpose Your Content
          </h1>
          <p className="text-muted-foreground mt-1">
            Paste a blog post, YouTube URL, or text and get 7 platform-ready
            outputs.
          </p>
        </div>
        <UsageBadge />
      </div>

      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Streaming indicator */}
      {isLoading && streamText && !outputs && (
        <div className="rounded-lg border bg-muted p-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating your content...
          </div>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
            {streamText.slice(-500)}
          </pre>
        </div>
      )}

      {/* Loading skeleton before stream starts */}
      {isLoading && !streamText && (
        <div className="rounded-lg border bg-muted p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to AI...
          </div>
        </div>
      )}

      {outputs && <OutputTabs outputs={outputs as Record<PlatformKey, string>} />}
    </div>
  );
}
