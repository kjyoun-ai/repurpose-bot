"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface UsageInfo {
  usage: number;
  limit: number;
  plan: string;
}

export function UsageBadge() {
  const [info, setInfo] = useState<UsageInfo | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
  }, []);

  if (!info) return null;

  const isLimited = info.limit !== -1;
  const atLimit = isLimited && info.usage >= info.limit;

  return (
    <div className="flex items-center gap-3">
      <Badge variant={atLimit ? "destructive" : "secondary"} className="text-xs">
        {isLimited
          ? `${info.usage} / ${info.limit} repurposes this month`
          : `${info.usage} repurposes this month`}
      </Badge>
      {isLimited && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          onClick={() => (window.location.href = "/dashboard/settings")}
        >
          <Zap className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      )}
    </div>
  );
}
