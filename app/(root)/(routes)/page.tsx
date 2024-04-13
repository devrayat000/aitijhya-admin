import Image from "next/image";

import logoSingle from "@/assets/logo_single.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col">
      <Link href="/">
        <div className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={240} />
        </div>
      </Link>
      {/* <div className="flex-1" /> */}
      <div className="p-6 lg:w-1/2 mx-auto">
        <div>
          <h2 className="text-3xl font-bangla font-bold text-center">
            নয়শো ঘন্টার অপচয় রোধ
          </h2>
        </div>
        <div className="mt-4">
          <p className="font-bangla text-lg text-center">
            প্রতিটা পরীক্ষার পর প্রশ্ন সলভ করতে হয়। প্রশ্ন, অপশন খুঁজতে আমাদের
            শত শত ঘন্টা অপচয় হয়। এই টুলস ব্যবহার করলে আপনি সেকেন্ডের মাঝেই
            রেফারেন্স খুঁজে পাবেন। বইয়ের কোথায় আছে, কীভাবে আছে, কোন বইতে আছে
            সবকিছু দেখতে পাবেন সেকেন্ডের মাঝে। বয়াকাডেমিকে অবশ্যই কাজে লাগাবে।
            ভর্তি পরীক্ষায় যেন এই টুলস তোমার ডে টু ডে ব্যবহারের সঙ্গী হয়।{" "}
          </p>
        </div>
        <div className="mt-14">
          <Button
            size="lg"
            asChild
            className="w-full lg:w-auto lg:mx-auto font-bangla text-2xl h-16 bg-card-result hover:bg-card-result/90"
          >
            <Link href="/search">তথ্যের জগতে যাত্রা শুরু হোক!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
