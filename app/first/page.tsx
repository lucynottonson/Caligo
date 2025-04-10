'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/navbar';

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ fontFamily: 'rubik' }}>
      <Navbar />
      <h1 className="text-center text-4xl font-bold mt-4">YOU ARE LOGGED IN</h1>
    </div>
  );
}
