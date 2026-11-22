import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FaqWidget from "@/components/FaqWidget";
import Footer from "@/components/Footer";
import Navigation from "../components/Nav";
import HideOnRoutes from "@/components/HideOnRoutes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Placeholder - Find what's worth seeing",
  description: "Search any place and discover its top attractions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-paper text-ink antialised">
        <HideOnRoutes routes={["/login", "signup"]}>
          <Navigation />
        </HideOnRoutes>
        <main className="flex-1">{children}</main>
        <FaqWidget />
        <Footer />
      </body>
    </html>
  );
}
