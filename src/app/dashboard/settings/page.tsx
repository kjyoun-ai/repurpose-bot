import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-2">Subscription</h2>
          <div className="rounded-lg border p-6">
            <p className="text-muted-foreground">
              You are on the <strong>Free</strong> plan (3 repurposes/month).
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Billing management coming soon.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <UserProfile />
        </section>
      </div>
    </div>
  );
}
