import Link from "next/link";
import Image from "next/image";

import logoSingle from "@/assets/logo_single.png";
import UserAvatar from "@/app/(root)/components/user-avatar";
import SearchForm from "../search/components/search-form";

export default function SearchHeader() {
  return (
    <header className="flex justify-between items-center gap-x-6 gap-y-2 px-3 lg:px-6 py-2 lg:py-3 z-50">
      <Link href="/" className="flex justify-center">
        <Image src={logoSingle} alt="logo" width={120} />
      </Link>
      <div className="hidden lg:flex flex-1 items-center gap-2">
        <div className="flex-1">
          <SearchForm />
        </div>
      </div>
      <UserAvatar />
    </header>
  );
}
