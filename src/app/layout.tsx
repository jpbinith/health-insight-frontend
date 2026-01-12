import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/main.scss';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { cookies } from 'next/headers';
import StoreProvider from './StoreProvider';
import type { AuthUser } from 'web/lib/state/slices/authSlice';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'HealthSight - AI Health Insights',
  description:
    'Leverage AI to gain valuable insights into your skin and contribute to eye health research with secure, transparent workflows.',
  icons: {
    icon: '/logo-zoom.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value ?? null;
  const authUserCookie = cookieStore.get('authUser')?.value ?? null;
  let initialUser: AuthUser | null = null;
  if (authUserCookie) {
    try {
      const decoded = decodeURIComponent(authUserCookie);
      const parsed = JSON.parse(decoded) as {
        fullName?: string | null;
        email?: string | null;
        [key: string]: unknown;
      };
      initialUser = {
        fullName: parsed.fullName ?? undefined,
        email: parsed.email ?? undefined,
      };
    } catch {
      initialUser = null;
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider initialToken={authToken} initialUser={initialUser}>
          <div className="o-page">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
