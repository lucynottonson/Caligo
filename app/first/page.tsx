'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function FirstPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/');
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
        <a href="/first">Home</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
        <a href="/users">Friends</a>
        <button onClick={async () => {
          await supabase.auth.signOut();
          router.replace('/');
        }}>
          Logout
        </button>
      </nav>
      <h1>YOU ARE LOGGED IN</h1>
    </div>
  );
}