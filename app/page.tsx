// app/page.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientLogin from '@/components/ClientLogin';

export default async function LoginPage() {
  const supabase = createPagesServerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // If a user is already logged in, immediately redirect
    redirect('/first');
  }

  // Otherwise, render the client login form
  return <ClientLogin />;
}