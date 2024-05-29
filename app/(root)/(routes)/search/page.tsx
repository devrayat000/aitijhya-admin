import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";

import logoSingle from "@/assets/logo_single.png";
import SearchForm from "./components/search-form";
import { Suspense } from "react";
import SearchResults from "./components/search-results";
import { ResultSkeleton } from "./components/result-card";
import Filters from "./components/filters";
import { SearchSchema } from "./components/searchSchema";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: SearchSchema;
}) {
  if (!searchParams?.query) {
    redirect("/", RedirectType.replace);
  }

  return (
    <div className="pt-4">
      <div className="flex items-center gap-2 pl-12 w-[calc(100%-100px)]">
        <Link href="/" className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={120} />
        </Link>
        <div className="flex-1">
          <SearchForm />
        </div>
      </div>
      <section className="flex gap-x-2">
        <aside className="basis-80">
          <ScrollArea className="h-[calc(100vh-5rem)] border-r border-border">
            <Filters searchParams={searchParams} />
          </ScrollArea>
        </aside>
        <main className="flex-1">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="pr-4">
              <Suspense fallback={<ResultSkeleton />}>
                <SearchResults searchParams={searchParams} />
              </Suspense>
            </div>
          </ScrollArea>
        </main>
      </section>
    </div>
  );
}
