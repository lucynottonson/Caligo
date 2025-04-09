'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/');
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading || !authorized) {
    return null; // Don't render children OR any layout stuff until ready
  }

  return <>{children}</>;
}