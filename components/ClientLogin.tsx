'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ClientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let authError = null;
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (!signUpError) {
          const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
          authError = loginError;
        } else {
          authError = signUpError;
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        authError = loginError;
      }

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/first');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'there is a problem';
      console.error('Auth error:', errorMessage);
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50 dark:bg-black text-purple-600 dark:text-blue-50">
      <h1 className="text-2xl font-bold mb-6">{isSignUp ? 'Join Caligo' : 'Login'}</h1>
      <form onSubmit={handleAuth} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-purple-600 rounded"
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-purple-600 rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-blue-50 py-2 rounded hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? (isSignUp ? 'Creating account...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Log In')}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError(null);
        }}
        className="mt-4 text-purple-600 hover:underline"
      >
        {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </button>
    </main>
  );
}
