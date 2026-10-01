import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Full Custom Tracker",
  description: "A fully customizable activity tracker",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tracker",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6F845F" },
    { media: "(prefers-color-scheme: dark)", color: "#221D18" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} antialiased h-full`}
        style={{ background: 'var(--bg-base)' }}
      >
        <ThemeProvider>
          <main className="min-h-full flex flex-col max-w-md mx-auto shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
            style={{ background: 'var(--bg-surface)' }}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
