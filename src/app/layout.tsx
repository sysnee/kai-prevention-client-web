import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { StyledEngineProvider } from '@mui/material/styles';
import './globals.css';
import '@fontsource/inter';
import { Providers } from './providers';
import { ToastProvider } from './providers/toast-provider';
import { NextAuthProvider } from './auth/providers/next-auth-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'RIS | KAI Prevention Center',
  description: 'Kai Prevention Center',
};

export default async function RootLayout({
  children,
}:
  Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <Providers>
            <ToastProvider />
            <AppRouterCacheProvider>
              <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
            </AppRouterCacheProvider>
          </Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
