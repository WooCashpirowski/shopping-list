'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Check if user's email is in the allowed list
    if (!loading && user) {
      const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
      const userEmail = user.email?.toLowerCase() || '';

      if (allowedEmails.length > 0 && !allowedEmails.includes(userEmail)) {
        // User authenticated but not in allowed list - sign them out
        signOut().then(() => router.push('/login'));
      }
    }
  }, [user, loading, router, signOut]);

  // Show loading state
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

  // Don't render children until authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
