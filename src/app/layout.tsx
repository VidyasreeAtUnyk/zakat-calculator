import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import './globals.css';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
});

export const metadata: Metadata = {
  title: 'Mal Zakat Calculator',
  description:
    'A guided, step-by-step Zakat calculator based on Islamic scholarly consensus',
    keywords: 'Zakat, calculator, Islamic finance, Nisab, halal',
    openGraph: {
      title: 'Mal Zakat Calculator',
      description: 'Calculate your Zakat accurately with live gold prices.',
      url: 'https://zakat-calculator-ruby.vercel.app',
      siteName: 'Mal Zakat Calculator',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mal Zakat Calculator',
      description: 'Calculate your Zakat accurately with live gold prices.',
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.gold-api.com" />
        <link rel="dns-prefetch" href="https://api.gold-api.com" />
      </head>
      <body className={`${inter.variable} ${notoArabic.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YW1XLRJE20"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YW1XLRJE20');
          `}
        </Script>
      </body>
    </html>
  );
}
