import { HistoryList } from "@/components/dashboard/history-list";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">History</h1>
      <p className="text-muted-foreground mt-1">
        Your past repurposes. Click to expand and re-copy.
      </p>
      <HistoryList />
    </div>
  );
}
