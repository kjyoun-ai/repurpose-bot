"use client";

import { useState } from "react";
import { InputForm } from "@/components/dashboard/input-form";
import { OutputTabs } from "@/components/dashboard/output-tabs";
import type { ToneType, PlatformKey } from "@/lib/constants";

export type RepurposeOutputs = Record<PlatformKey, string>;

export default function DashboardPage() {
  const [outputs, setOutputs] = useState<RepurposeOutputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(text: string, tone: ToneType) {
    setIsLoading(true);
    setError(null);
    setOutputs(null);

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

      // Read streaming response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        // Try to parse partial JSON for progressive display
        try {
          const parsed = JSON.parse(accumulated);
          if (parsed.outputs) {
            setOutputs(parsed.outputs);
          }
        } catch {
          // Not complete JSON yet, keep accumulating
        }
      }

      // Final parse
      const final = JSON.parse(accumulated);
      if (final.outputs) {
        setOutputs(final.outputs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Repurpose Your Content
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste a blog post, YouTube URL, or text and get 7 platform-ready
          outputs.
        </p>
      </div>

      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {outputs && <OutputTabs outputs={outputs} />}
    </div>
  );
}
