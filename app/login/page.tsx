'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Button from '@/components/ui/button';
import { CheckCircleIcon, ErrorCircleIcon, EyeIcon, EyeSlashIcon, ShoppingCartIcon } from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { signInWithPassword, signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signInWithPassword(email, password);

    if (error) {
      if (error.message.includes('nie ma dostępu')) {
        setMessage({ 
          type: 'error', 
          text: 'Ten adres email nie ma dostępu do aplikacji. Tylko autoryzowani użytkownicy mogą się zalogować.' 
        });
      } else if (error.message.includes('Invalid login credentials')) {
        setMessage({ type: 'error', text: 'Nieprawidłowy email lub hasło.' });
      } else if (error.message.includes('User already registered')) {
        setMessage({ type: 'error', text: 'To konto już istnieje. Zaloguj się.' });
      } else {
        setMessage({ type: 'error', text: 'Wystąpił błąd. Spróbuj ponownie.' });
      }
      setLoading(false);
    } else {
      if (isSignUp) {
        setMessage({
          type: 'success',
          text: 'Konto utworzone! Możesz się teraz zalogować.',
        });
        setIsSignUp(false);
        setPassword('');
        setLoading(false);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {authLoading ? (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
            <ShoppingCartIcon />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{isSignUp ? 'Rejestracja' : 'Zaloguj się'}</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adres email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="twoj@email.pl"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Hasło
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeSlashIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            fullWidth
          >
            {loading ? 'Ładowanie...' : (isSignUp ? 'Utwórz konto' : 'Zaloguj się')}
          </Button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            disabled={loading}
          >
            {isSignUp ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-start">
              {message.type === 'success' ? (
                <CheckCircleIcon />
              ) : (
                <ErrorCircleIcon />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {isSignUp 
              ? 'Hasło musi mieć minimum 6 znaków.'
              : 'Twoja sesja będzie pamiętana na tym urządzeniu.'}
          </p>
        </div>
        </div>
      )}
    </div>
  );
}
