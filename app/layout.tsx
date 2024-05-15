import { Inter, Tiro_Bangla } from "next/font/google";
import { Metadata } from "next";

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
  description: `প্রতিটা পরীক্ষার পর প্রশ্ন সলভ করতে হয়। প্রশ্ন, অপশন
  খুঁজতে আমাদের শত শত ঘন্টা অপচয় হয়। এই টুলস
  ব্যবহার করলে আপনি সেকেন্ডের মাঝেই রেফারেন্স
 খুঁজে পাবেন। বইয়ের কোথায় আছে, কীভাবে আছে, 
 কোন বইতে আছে সবকিছু দেখতে পাবেন সেকেন্ডের
 মাঝে। বয়াকাডেমিকে অবশ্যই কাজে লাগাবে। ভর্তি
  পরীক্ষায় যেন এই টুলস তোমার ডে টু ডে ব্যবহারের
  সঙ্গী হয়।`.replace(/\s+/g, " "),
  alternates: { canonical: "https://taalaash.com" },
  appleWebApp: { capable: true, title: "Taalaash" },
  applicationName: "Taalaash",
  bookmarks: "https://taalaash.com/bookmarks",
  category: "Education",
  generator: "Next.js",
  openGraph: {
    description: `প্রতিটা পরীক্ষার পর প্রশ্ন সলভ করতে হয়। প্রশ্ন, অপশন
  খুঁজতে আমাদের শত শত ঘন্টা অপচয় হয়। এই টুলস
  ব্যবহার করলে আপনি সেকেন্ডের মাঝেই রেফারেন্স
 খুঁজে পাবেন। বইয়ের কোথায় আছে, কীভাবে আছে, 
 কোন বইতে আছে সবকিছু দেখতে পাবেন সেকেন্ডের
 মাঝে। বয়াকাডেমিকে অবশ্যই কাজে লাগাবে। ভর্তি
  পরীক্ষায় যেন এই টুলস তোমার ডে টু ডে ব্যবহারের
  সঙ্গী হয়।`.replace(/\s+/g, " "),
  },
  icons: [{ url: logo.src, rel: "icon" }],
  metadataBase: new URL("https://taalaash.com"),
  authors: {
    name: "Zul Ikram Musaddik Rayat",
    url: "https://twitter.com/zul_rayat",
  },
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
        {children}
      </body>
    </html>
  );
}
