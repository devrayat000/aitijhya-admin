import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";

import logoSingle from "@/assets/logo_single.png";
import SearchForm from "./components/search-form";
import { Suspense } from "react";
import SearchResults from "./components/search-results";
import { ResultSkeleton } from "./components/result-card";
import Filters from "./components/filters";

// TODO: Implement zod validation of search params
export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query: string; page?: string; subjects?: string[] };
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
      <section className="flex">
        <aside className="basis-80 border-r border-border">
          <Filters searchParams={searchParams} />
        </aside>
        <main className="flex-1">
          <Suspense fallback={<ResultSkeleton />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </main>
      </section>
    </div>
  );
}
