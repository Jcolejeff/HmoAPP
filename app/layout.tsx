import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { Inter } from 'next/font/google';

import ReactQueryProviders from '@/lib/react-query/provider';

import RootClientLayout from './client-layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HMO',
  description: 'Manage your travel plans with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-hidden overflow-y-auto scroll-smooth`}>
        <ReactQueryProviders>
          <RootClientLayout>{children}</RootClientLayout>
        </ReactQueryProviders>

        <Toaster richColors />
      </body>
    </html>
  );
}
