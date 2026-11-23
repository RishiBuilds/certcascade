import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  keywords: [
    "bulk certificate generator",
    "certificate maker",
    "report card generator",
    "ID card generator",
    "CSV to certificates",
  ],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
      <body className="flex min-h-dvh flex-col bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}