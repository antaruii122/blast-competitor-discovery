'use client';

import type { Metadata } from "next";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { GoogleOAuthProvider } from '@react-oauth/google';
import theme from '@/theme/theme';
import Navbar from '@/components/Navbar';
import "./globals.css";

// Note: In production, move this to environment variable
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
