import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  EditorFooterGate,
  EditorViewProvider,
} from "@/components/shared/EditorViewContext";

const siteName = "CertCascade";
const description =
  "Upload your design and generate hundreds of professional certificates in just a few clicks.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: `${siteName}: bulk certificates, report cards and IDs`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  authors: [{ name: "Rishi Chaurasia", url: "https://github.com/RishiBuilds" }],
  keywords: [
    "bulk certificate generator",
    "certificate maker",
    "report card generator",
    "ID card generator",
    "CSV to certificates",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: "Generate professional certificates in bulk with ease.",
    images: [{ url: "/logo.svg", alt: `${siteName} logo` }],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: "Generate professional certificates in bulk with ease.",
    images: ["/logo.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8884A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-white text-gray-900 antialiased">
        <EditorViewProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <div
            id="main-content"
            tabIndex={-1}
            className="flex min-h-0 flex-1 flex-col outline-none"
          >
            {children}
          </div>
          <EditorFooterGate>
            <Footer />
          </EditorFooterGate>
        </EditorViewProvider>
      </body>
    </html>
  );
}