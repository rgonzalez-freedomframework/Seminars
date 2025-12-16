import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider"
import { Manrope } from "next/font/google";
import {ClerkProvider} from '@clerk/nextjs'
import "./globals.css";

const manrope=Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})


export const metadata: Metadata = {
  title: "Freedom Framework™",
  description: "AI Powered Webinar Streaming & Sales Platform",
  icons: {
  icon: [
    { url: '/favicon.png', type: 'image/png' },
  ],
},
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F7F4' },
    { media: '(prefers-color-scheme: dark)', color: '#F6F7F4' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Freedom Framework™',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#F6F7F4' }}>
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content="#F6F7F4" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        </head>
        <body
          className={`${manrope.variable} antialiased`}
          suppressHydrationWarning
          style={{ backgroundColor: '#F6F7F4' }}
        >
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
