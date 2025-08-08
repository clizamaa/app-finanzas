import { Inter } from "next/font/google";
import "./globals.css";
import { DefaultSeo } from 'next-seo';
import defaultSEOConfig from '../../next-seo.config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "AppFinanzasHoy - Tu Guía de Finanzas Personales",
    template: "%s | AppFinanzasHoy"
  },
  description: "Descubre las mejores aplicaciones de finanzas personales, reviews detalladas y tutoriales para gestionar tu dinero de manera inteligente.",
  keywords: "finanzas personales, aplicaciones financieras, presupuesto, ahorro, inversión, reviews apps financieras",
  authors: [{ name: "AppFinanzasHoy Team" }],
  creator: "AppFinanzasHoy",
  publisher: "AppFinanzasHoy",
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.SITE_URL || 'http://localhost:3000',
    siteName: "AppFinanzasHoy",
    title: "AppFinanzasHoy - Tu Guía de Finanzas Personales",
    description: "Descubre las mejores aplicaciones de finanzas personales, reviews detalladas y tutoriales para gestionar tu dinero de manera inteligente.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AppFinanzasHoy - Finanzas Personales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AppFinanzasHoy - Tu Guía de Finanzas Personales",
    description: "Descubre las mejores aplicaciones de finanzas personales, reviews detalladas y tutoriales para gestionar tu dinero de manera inteligente.",
    images: ["/images/og-image.jpg"],
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
