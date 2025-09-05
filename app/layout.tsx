import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlashTrade Sim - Learn Trading Without Risk',
  description: 'Practice trading strategies in a simulated environment and analyze your performance on Base.',
  keywords: 'trading, simulation, Base, cryptocurrency, learning, practice',
  authors: [{ name: 'FlashTrade Sim' }],
  openGraph: {
    title: 'FlashTrade Sim',
    description: 'Learn, Practice, and Master Trading Without Risk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashTrade Sim',
    description: 'Learn, Practice, and Master Trading Without Risk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
