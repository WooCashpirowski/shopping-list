'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
      return;
    }

    if (!loading && user) {
      const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
      const userEmail = user.email?.toLowerCase() || '';

      if (allowedEmails.length > 0 && !allowedEmails.includes(userEmail)) {
        signOut().then(() => router.push('/login'));
      }
    }
  }, [user, loading, router, signOut, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
