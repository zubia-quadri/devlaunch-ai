import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "DevLaunch AI — Developer Career Platform",
    template: "%s | DevLaunch AI",
  },
  description:
    "Transform your GitHub profile into a professional portfolio with AI-powered insights, skill analytics, and a beautiful public portfolio page.",
  keywords: [
    "developer portfolio",
    "github portfolio",
    "AI developer tools",
    "tech career",
    "developer resume",
    "coding portfolio",
  ],
  authors: [{ name: "DevLaunch AI" }],
  creator: "DevLaunch AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "DevLaunch AI",
    title: "DevLaunch AI — Developer Career Platform",
    description:
      "Transform your GitHub profile into a professional portfolio with AI-powered Developer Insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevLaunch AI",
    description: "AI-powered developer career platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
