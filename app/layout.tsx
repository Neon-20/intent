import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stepping Stones - Job Portal & Career Consultancy",
    template: "%s | Stepping Stones"
  },
  description: "Find your dream job and get expert career guidance with Stepping Stones. Browse curated job opportunities, get professional resume reviews, and receive personalized career consultancy.",
  keywords: ["jobs", "career", "resume review", "career consultancy", "job portal", "job search", "career guidance", "professional development"],
  authors: [{ name: "Stepping Stones" }],
  creator: "Stepping Stones",
  publisher: "Stepping Stones",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://steppingstones.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Stepping Stones",
    title: "Stepping Stones - Job Portal & Career Consultancy",
    description: "Find your dream job and get expert career guidance with Stepping Stones. Browse curated job opportunities, get professional resume reviews, and receive personalized career consultancy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stepping Stones - Job Portal & Career Consultancy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepping Stones - Job Portal & Career Consultancy",
    description: "Find your dream job and get expert career guidance with Stepping Stones.",
    images: ["/og-image.png"],
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
    // TODO: Add Google Search Console verification code
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
