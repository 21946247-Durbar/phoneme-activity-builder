import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Phoneme Activity Builder - Speech Pathology Tool',
  description: 'Build phoneme-based Wordle and Word Search activities for Speech Pathology students and teachers.',
  keywords: 'phoneme, speech pathology, wordle, word search, HCE, Australian English',
  authors: [{ name: 'Sudipta Biswas Durbar', url: 'https://github.com/21946247-Durbar' }],
  creator: 'Sudipta Biswas Durbar',
  publisher: 'La Trobe University',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200`}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}