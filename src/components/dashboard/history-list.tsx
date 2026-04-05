"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OutputTabs } from "@/components/dashboard/output-tabs";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import type { PlatformKey } from "@/lib/constants";

interface RepurposeEntry {
  id: string;
  input_text: string;
  input_source: string;
  tone: string;
  outputs: Record<PlatformKey, string>;
  created_at: string;
}

export function HistoryList() {
  const [entries, setEntries] = useState<RepurposeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        No repurposes yet. Go create your first one!
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {entries.map((entry) => {
        const expanded = expandedId === entry.id;
        const date = new Date(entry.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Card key={entry.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpandedId(expanded ? null : entry.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-medium truncate">
                    {entry.input_text.slice(0, 120)}
                    {entry.input_text.length > 120 ? "..." : ""}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {entry.tone}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {entry.input_source}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {date}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="ml-2 shrink-0">
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expanded && (
              <CardContent>
                <OutputTabs outputs={entry.outputs} />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
