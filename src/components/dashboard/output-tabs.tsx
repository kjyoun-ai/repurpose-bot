"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutputCard } from "@/components/dashboard/output-card";
import { PLATFORMS, type PlatformKey } from "@/lib/constants";
import {
  Briefcase,
  AtSign,
  Camera,
  Mail,
  MessageSquare,
  Video,
  Send,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  AtSign,
  Camera,
  Mail,
  MessageSquare,
  Video,
  Send,
};

interface OutputTabsProps {
  outputs: Record<PlatformKey, string>;
}

export function OutputTabs({ outputs }: OutputTabsProps) {
  return (
    <Tabs defaultValue="linkedin" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1">
        {PLATFORMS.map((platform) => {
          const Icon = iconMap[platform.icon];
          return (
            <TabsTrigger
              key={platform.key}
              value={platform.key}
              className="flex items-center gap-1.5"
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{platform.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {PLATFORMS.map((platform) => (
        <TabsContent key={platform.key} value={platform.key} className="mt-4">
          <OutputCard
            platform={platform.label}
            content={outputs[platform.key] || ""}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
