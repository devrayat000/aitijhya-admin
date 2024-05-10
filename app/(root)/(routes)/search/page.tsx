import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";

import logoSingle from "@/assets/logo_single.png";
import SearchForm from "./components/search-form";
import { Suspense } from "react";
import SearchResults from "./components/search-results";
import { ResultSkeleton } from "./components/result-card";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query: string; page?: string };
}) {
  if (!searchParams?.query) {
    redirect("/", RedirectType.replace);
  }

  return (
    <div className="px-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={120} />
        </Link>
        <div className="flex-1">
          <SearchForm />
        </div>
      </div>
      <Suspense fallback={<ResultSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
