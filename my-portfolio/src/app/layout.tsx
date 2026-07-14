import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simran Verma | Digital Marketing Specialist",
  description:
    "Simran Verma is a digital marketing specialist focused on Google My Business, SEO, and Google Ads — helping local businesses grow their online visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-slate-700 antialiased">
        {children}
      </body>
    </html>
  );
}
