import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "BuildFolio — Turn what you build into your next opportunity",
    template: "%s | BuildFolio",
  },
  description:
    "Connect your GitHub, paste a job description, and BuildFolio finds the 2–3 projects that best match the role — then turns them into a tailored, ATS-ready resume.",
  keywords: [
    "developer resume",
    "github resume builder",
    "AI developer tools",
    "tech career",
    "tailored resume",
    "coding portfolio",
    "BuildFolio",
  ],
  authors: [{ name: "BuildFolio" }],
  creator: "BuildFolio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "BuildFolio",
    title: "BuildFolio — Turn what you build into your next opportunity",
    description:
      "Connect your GitHub, paste a job description, and BuildFolio finds the 2–3 projects that best match the role — then turns them into a tailored, ATS-ready resume.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildFolio",
    description: "Turn what you build into your next opportunity.",
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
