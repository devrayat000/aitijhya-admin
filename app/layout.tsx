import { Inter, Tiro_Bangla } from "next/font/google";

import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--inter" });
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  variable: "--tiro-bangla",
  subsets: ["bengali"],
});

export const metadata = {
  title: "Dashboard",
  description: "E-Commerce Dashboard",
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
