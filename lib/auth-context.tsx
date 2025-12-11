'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseAuth } from '@/lib/supabase-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkEmailAllowed = (email: string): boolean => {
    const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    const normalizedEmail = email.trim().toLowerCase();
    return allowedEmails.length === 0 || allowedEmails.includes(normalizedEmail);
  };

  const signInWithPassword = async (email: string, password: string) => {
    try {
      if (!checkEmailAllowed(email)) {
        return { error: new Error('Ten adres email nie ma dostępu do aplikacji.') };
      }

      const { error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!checkEmailAllowed(email)) {
        return { error: new Error('Ten adres email nie ma dostępu do aplikacji.') };
      }

      const { error } = await supabaseAuth.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabaseAuth.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithPassword, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
