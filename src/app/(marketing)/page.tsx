import Link from "next/link";
import {
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Zap,
    title: "One Click, Seven Outputs",
    description:
      "Paste your content once and get platform-optimized posts for LinkedIn, X, Instagram, newsletters, Reddit, TikTok, and email.",
  },
  {
    icon: Clock,
    title: "Save Hours Every Week",
    description:
      "Stop manually reformatting content for each platform. What took 2-4 hours now takes 30 seconds.",
  },
  {
    icon: CheckCircle2,
    title: "Platform-Native Quality",
    description:
      "Each output follows the best practices of its platform — character limits, hashtag conventions, tone, and formatting.",
  },
];

const PLATFORMS = [
  "LinkedIn",
  "X / Twitter",
  "Instagram",
  "Newsletter",
  "Reddit",
  "TikTok",
  "Email",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Sparkles className="h-4 w-4" />
          AI-powered content repurposing
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Turn One Piece of Content
          <br />
          <span className="text-primary">Into Seven</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Paste a blog post, YouTube video, or any text. Get instantly
          optimized content for LinkedIn, X, Instagram, newsletters, Reddit,
          TikTok, and email.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          3 free repurposes per month. No credit card required.
        </p>
      </section>

      {/* Platform badges */}
      <section className="border-y bg-muted/50 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            Optimized outputs for
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {PLATFORMS.map((p) => (
              <span
                key={p}
                className="rounded-full border bg-background px-4 py-1.5 text-sm font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight mb-12">
          Why RepurposeBot?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-none">
              <CardContent className="pt-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/50 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Paste Your Content",
                desc: "Blog post, YouTube URL, or any text.",
              },
              {
                step: "2",
                title: "Choose Your Tone",
                desc: "Professional, casual, witty, or educational.",
              },
              {
                step: "3",
                title: "Get 7 Outputs",
                desc: "Copy, edit, and post to each platform.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Ready to 7x Your Content Output?
        </h2>
        <p className="text-muted-foreground mb-8">
          Start with 3 free repurposes. Upgrade when you need more.
        </p>
        <Link href="/sign-up">
          <Button size="lg">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
