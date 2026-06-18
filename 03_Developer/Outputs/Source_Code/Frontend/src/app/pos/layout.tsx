'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={['staff', 'admin']} loginPath="/pos/login">
      <div className="flex min-h-screen bg-slate-100">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </RouteGuard>
  );
}
