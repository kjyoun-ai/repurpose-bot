export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">History</h1>
      <p className="text-muted-foreground mt-1">
        Your past repurposes will appear here.
      </p>
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        No repurposes yet. Go create your first one!
      </div>
    </div>
  );
}
