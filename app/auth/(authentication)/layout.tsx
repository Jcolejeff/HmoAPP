'use client';

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid h-full w-full grid-cols-1">
      <div className="py-8">{children}</div>
    </section>
  );
}
