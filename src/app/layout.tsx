import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/main.scss';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'HealthSight - AI Health Insights',
  description:
    'Leverage AI to gain valuable insights into your skin and contribute to eye health research with secure, transparent workflows.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="o-page">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
