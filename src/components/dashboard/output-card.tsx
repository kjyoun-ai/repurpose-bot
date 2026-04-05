"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const WATERMARK = "\n\n---\nMade with RepurposeBot (repurposebot.com)";

interface OutputCardProps {
  platform: string;
  content: string;
  isFree?: boolean;
}

export function OutputCard({ platform, content, isFree = true }: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  // Reset edited content when content prop changes (new generation)
  useEffect(() => {
    setEditedContent(content);
    setIsEditing(false);
  }, [content]);

  async function handleCopy() {
    const textToCopy = isFree ? editedContent + WATERMARK : editedContent;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-medium">{platform}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {editedContent.length} chars
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Preview" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={10}
            className="resize-y font-mono text-sm"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed rounded-lg bg-muted p-4">
            {editedContent || "No content generated for this platform."}
          </div>
        )}
        {isFree && (
          <p className="text-xs text-muted-foreground mt-2">
            Free tier: copied text includes &quot;Made with RepurposeBot&quot;
            watermark. Upgrade to remove.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
