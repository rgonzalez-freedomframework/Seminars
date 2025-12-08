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
  title: "Spotlight",
  description: "AI Powered Webinar Streaming & Sales Platform",
  icons: {
  icon: [
    { url: '/favicon.png', type: 'image/png' },
  ],
},
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FEFDFB' },
    { media: '(prefers-color-scheme: dark)', color: '#FEFDFB' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Spotlight',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content="#FEFDFB" />
        </head>
        <body
          className={`${manrope.variable} antialiased`}
          suppressHydrationWarning
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
