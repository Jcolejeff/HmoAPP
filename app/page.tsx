import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Text } from '@/components/ui/text';

export default function Home() {
  redirect('/auth/signin');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-2 text-center">
        <div>
          <Text weight={'bold'} size={'2xl'}>
            HMO
          </Text>
        </div>

        <div className="flex items-center justify-center gap-8">
          <Link href={'/auth/signin'} className="border p-2">
            Login
          </Link>
          <Link href={'/auth/signup'} className="border p-2">
            SignUp
          </Link>
        </div>
      </div>
    </main>
  );
}
