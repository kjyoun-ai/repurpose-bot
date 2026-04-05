import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "RepurposeBot — Turn One Piece of Content Into Seven",
  description:
    "Paste a blog post, YouTube video, or text and get platform-optimized content for LinkedIn, X, Instagram, newsletters, Reddit, TikTok, and email in one click.",
  openGraph: {
    title: "RepurposeBot — Turn One Piece of Content Into Seven",
    description:
      "AI-powered content repurposing. One input, seven platform-ready outputs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
