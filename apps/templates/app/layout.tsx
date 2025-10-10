import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";
import { AppSolanaLayout } from "@/components/app-solana-layout";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#14F195",
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  title: "Solana Templates",
  description: "Templates for create-solana-dapp",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Solana Templates",
  },
  openGraph: {
    title: "Solana Templates",
    description: "Templates for create-solana-dapp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Templates",
    description: "Templates for create-solana-dapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ServiceWorkerRegistration />
        <div className="min-h-screen bg-gradient-to-br from-purple-500/5 via-background via-50% to-emerald-400/8">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/3 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/3 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <AppProviders>
              <AppSolanaLayout>{children}</AppSolanaLayout>
            </AppProviders>
          </div>
        </div>
      </body>
    </html>
  );
}
