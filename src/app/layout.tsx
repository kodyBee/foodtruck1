import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import Analytics from "@/components/Analytics";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crown Majestic Kitchen - Royal Flavors on Wheels",
  description: "Experience gourmet street food with crown-worthy presentation. Find our food truck, explore our menu, and book us for your next event.",
  keywords: ["food truck", "gourmet", "street food", "catering", "Crown Majestic Kitchen", "wings", "cheesesteak", "mac and cheese"],
  authors: [{ name: "Crown Majestic Kitchen" }],
  creator: "Crown Majestic Kitchen",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Crown Majestic Kitchen',
    title: 'Crown Majestic Kitchen - Royal Flavors on Wheels',
    description: 'Experience gourmet street food with crown-worthy presentation. Find our food truck, explore our menu, and book us for your next event.',
    images: [
      {
        url: '/truckpic2.jpg',
        width: 1200,
        height: 630,
        alt: 'Crown Majestic Kitchen Food Truck',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crown Majestic Kitchen - Royal Flavors on Wheels',
    description: 'Experience gourmet street food with crown-worthy presentation.',
    images: ['/truckpic2.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
