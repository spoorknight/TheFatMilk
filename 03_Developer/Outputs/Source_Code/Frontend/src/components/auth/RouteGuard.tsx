'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalStore } from '@/store/global.store';

interface RouteGuardProps {
  allowedRoles: string[];
  loginPath: string;
  children: React.ReactNode;
}

/**
 * RouteGuard – Client-side role-based route protection.
 * Redirects to `loginPath` if user is not authenticated or lacks the required role.
 */
export const RouteGuard = ({ allowedRoles, loginPath, children }: RouteGuardProps) => {
  const { user, token } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Skip guard on login pages themselves
    if (pathname === loginPath) {
      setAuthorized(true);
      return;
    }

    // Not authenticated
    if (!token || !user) {
      router.replace(loginPath);
      return;
    }

    // Wrong role
    if (!allowedRoles.includes(user.role)) {
      router.replace(loginPath);
      return;
    }

    setAuthorized(true);
  }, [token, user, allowedRoles, loginPath, router, pathname]);

  if (!authorized && pathname !== loginPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return <>{children}</>;
};
