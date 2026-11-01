export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-24 bg-card border rounded-xl" />
        <div className="h-24 bg-card border rounded-xl" />
        <div className="h-24 bg-card border rounded-xl" />
        <div className="h-24 bg-card border rounded-xl" />
      </div>
      <div className="h-64 bg-card border rounded-xl" />
    </div>
  );
}
