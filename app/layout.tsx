import { Inter, Tiro_Bangla } from "next/font/google";
import { Metadata } from "next";

import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import logo from "@/assets/logo_single.png";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--inter" });
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  variable: "--tiro-bangla",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "Taalaash",
  alternates: { canonical: "https://taalaash.com" },
  appleWebApp: { capable: true, title: "Taalaash" },
  applicationName: "Taalaash",
  bookmarks: "https://taalaash.com/bookmarks",
  category: "Education",
  generator: "Next.js",
  icons: logo.src,
  metadataBase: new URL("https://taalaash.com"),
};

export const dynamic = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        // className={cn(inter.className, tiroBangla.className)}
        className={cn(inter.variable, tiroBangla.variable)}
      >
        <ToastProvider />
        <ModalProvider />
        {children}
      </body>
    </html>
  );
}
