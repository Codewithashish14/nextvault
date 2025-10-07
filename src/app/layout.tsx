import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { MasterPasswordProvider } from '@/context/MasterPasswordContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Secure Vault - Password Manager',
  description: 'A secure password manager with client-side encryption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <MasterPasswordProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </MasterPasswordProvider>
        </SessionProvider>
      </body>
    </html>
  );
}