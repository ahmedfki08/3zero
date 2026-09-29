import type { Metadata } from 'next';
import { Geist, Geist_Mono, Space_Grotesk, Oswald } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/ui/SmoothScroll';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: '3-Zero Campus Club ISIMS | Zero Exclusion, Zero Carbon, Zero Poverty',
  description:
    'Official digital platform for the 3-Zero Campus Club at the Higher Institute of Computer Science and Multimedia of Sfax (ISIMS). Driving student technological solutions for Zero Poverty, Zero Carbon, and Zero Exclusion.',
  keywords: [
    '3 Zero',
    'ISIMS',
    'University of Sfax',
    'Zero Poverty',
    'Zero Carbon',
    'Zero Exclusion',
    'Muhammad Yunus',
    'Campus Club',
    'Tunisia Tech',
  ],
  authors: [{ name: '3-Zero ISIMS Engineering Team' }],
  openGraph: {
    title: '3-Zero Campus Club ISIMS | Technological Innovation for a World of Three Zeros',
    description:
      'Explore active student projects, IoT campus grids, and social ventures incubated at ISIMS Sfax.',
    siteName: '3-Zero ISIMS',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFCFA] text-[#0F172A] font-sans">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
