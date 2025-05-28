import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Replyas | Modern Team Inbox for Seamless Email Collaboration',
  description:
    'Transform your team email workflow with Replyas. Forward emails, send from custom domains, and collaborate in real-time with a Linear-inspired interface designed for modern teams.',
  openGraph: {
    title: 'Replyas | Modern Team Inbox for Seamless Email Collaboration',
    description:
      'Transform your team email workflow with Replyas. Forward emails, send from custom domains, and collaborate in real-time with a Linear-inspired interface designed for modern teams.',
    type: 'website',
    siteName: 'Replyas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Replyas | Modern Team Inbox for Seamless Email Collaboration',
    description:
      'Transform your team email workflow with Replyas. Forward emails, send from custom domains, and collaborate in real-time with a Linear-inspired interface.',
    creator: '@replyas',
  },
  keywords: [
    'shared inbox',
    'team email',
    'email collaboration',
    'custom domain email',
    'email forwarding',
    'team communication',
    'Linear-style interface',
  ],
  authors: [{ name: 'Rajat Mondal' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${poppins.variable} antialiased w-full overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
