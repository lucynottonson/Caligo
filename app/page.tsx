import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientLogin from '@/components/ClientLogin';

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/first'); 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
          Welcome to Caligo
        </h1>
        <p className="text-center text-lg text-gray-600 mb-4">
          Log in or join to see everything else :)
        </p>
        
        <ClientLogin />
      </div>
    </div>
  );
}