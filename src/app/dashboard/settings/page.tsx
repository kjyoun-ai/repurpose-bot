"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Zap } from "lucide-react";
import { PLANS } from "@/lib/constants";

const PLAN_DISPLAY: Record<
  string,
  { label: string; description: string }
> = {
  free: { label: "Free", description: "3 repurposes per month" },
  pro: { label: "Pro", description: "Unlimited repurposes" },
  annual: { label: "Pro (Annual)", description: "Unlimited repurposes, billed yearly" },
};

export default function SettingsPage() {
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((data) => setPlan(data.plan || "free"))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckout(priceId: string, planKey: string) {
    setCheckoutLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  const isPaid = plan === "pro" || plan === "annual";
  const display = PLAN_DISPLAY[plan] || PLAN_DISPLAY.free;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your plan and billing</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={isPaid ? "default" : "secondary"}>
                  {display.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {display.description}
                </span>
              </div>

              {isPaid ? (
                <Button
                  variant="outline"
                  onClick={handlePortal}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Manage Subscription
                </Button>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Pro Monthly</CardTitle>
                      <div>
                        <span className="text-3xl font-bold">$29</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Unlimited repurposes
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          All 7 platforms
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Full history access
                        </li>
                      </ul>
                      <Button
                        className="w-full"
                        disabled={checkoutLoading !== null}
                        onClick={() =>
                          handleCheckout(
                            process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!,
                            "pro"
                          )
                        }
                      >
                        {checkoutLoading === "pro" ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2" />
                        )}
                        Upgrade to Pro
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Pro Annual</CardTitle>
                      <div>
                        <span className="text-3xl font-bold">$249</span>
                        <span className="text-muted-foreground">/year</span>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">
                        Save 28%
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Everything in Pro
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Save $99/year
                        </li>
                      </ul>
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled={checkoutLoading !== null}
                        onClick={() =>
                          handleCheckout(
                            process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID!,
                            "annual"
                          )
                        }
                      >
                        {checkoutLoading === "annual" ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2" />
                        )}
                        Upgrade to Annual
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <UserProfile />
        </CardContent>
      </Card>
    </div>
  );
}
