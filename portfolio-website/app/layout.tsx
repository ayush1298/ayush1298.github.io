import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Ayush Munot - Software Engineer & Developer",
  description: "Full-stack developer passionate about creating innovative solutions. Experienced in React, Next.js, Python, and modern web technologies.",
  keywords: ["Ayush Munot", "Software Engineer", "Full Stack Developer", "React", "Next.js", "Python", "Web Development"],
  authors: [{ name: "Ayush Munot", url: "https://github.com/ayush1298" }],
  creator: "Ayush Munot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ayush1298.github.io",
    title: "Ayush Munot - Software Engineer & Developer",
    description: "Full-stack developer passionate about creating innovative solutions.",
    siteName: "Ayush Munot Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Munot - Software Engineer & Developer",
    description: "Full-stack developer passionate about creating innovative solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}