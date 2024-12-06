import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for bid requests */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">No bid requests yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first bid request to get started
          </p>
        </div>
      </div>
    </div>
  );
}