import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const poppins = Poppins({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CareLink",
  description: "Easy, Online, Healthcare, Management",
  keywords: [
    "healthcare",
    "medical management",
    "patient care",
    "online healthcare",
    "medical services",
  ],
  authors: [
    {
      name: "Mladen Stankov, Ivan Petrov, Kris Petkov, Viktor Velkov, Ivan Matev",
    },
  ],
  openGraph: {
    title: "CareLink - Healthcare Management Made Easy",
    description: "Easy, Online, Healthcare, Management",
    type: "website",
    siteName: "CareLink",
    locale: "bg_BG",
    images: [
      {
        url: "https://carelink.bg/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your image alt text",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareLink - Healthcare Management Made Easy",
    description: "Easy, Online, Healthcare, Management",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} ${poppins.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
