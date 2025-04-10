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
        <ClientLogin />
      </div>
    </div> 
  );
}
