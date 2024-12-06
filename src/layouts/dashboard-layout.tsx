import { Outlet } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-500">Verso</span>
            <span className="text-red-500">Bid</span>
          </h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}