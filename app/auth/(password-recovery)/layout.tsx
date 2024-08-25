import Image from 'next/image';

import { url } from '@/lib/utils';

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-screen overflow-hidden">
      {children}
      <div className="absolute bottom-0 left-0 right-0 hidden w-full lg:block">
        <Image src={url('/images/auth/linth.svg')} layout="responsive" width={1920} height={100} alt="" priority />
      </div>
    </section>
  );
}
