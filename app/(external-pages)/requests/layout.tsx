'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ExternalPagesLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const organizationId = searchParams.get('org_id');
  const requestId = searchParams.get('req_id');

  const router = useRouter();
  sessionStorage.setItem('token', token || '');
  sessionStorage.setItem('organizationId', organizationId || '');
  sessionStorage.setItem('requestId', requestId || '');

  // searchParams.delete();

  useEffect(() => {
    if (!token || !organizationId || !requestId) {
      router.push('/auth/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, organizationId, requestId]);
  useEffect(() => {
    if (window !== undefined) {
    }
  }, []);

  if (token && organizationId && requestId) {
    return <section className="h-screen w-full scroll-smooth bg-primary-3 ">{children}</section>;
  }

  return <></>;
}
