import { Outlet } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}