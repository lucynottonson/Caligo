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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-6 font-[var(--font-chivo-mono)]">Login</h1>
        <p className="text-center text-lg text-gray-600 mb-4">Enter your credentials to access your account</p>
        
        <ClientLogin />
        
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
            Login
          </button>
          
          <button className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
