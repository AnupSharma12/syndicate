import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PageWrapper } from '@/components/page-wrapper';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Syndicate ESP',
  description: 'The ultimate destination for competitive gaming.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="https://iili.io/fo18z3G.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <PageWrapper>
            {children}
            <Toaster />
          </PageWrapper>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
