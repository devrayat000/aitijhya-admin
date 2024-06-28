import { RedirectType, redirect } from "next/navigation";
import { Suspense } from "react";

import SearchForm from "./components/search-form";
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
    <div>
      <div className="flex flex-col lg:hidden items-stretch gap-2 pb-2 px-1">
        <SearchForm />
        <Suspense>
          <Filters searchParams={searchParams} />
        </Suspense>
      </div>
      <section className="flex gap-x-2">
        <aside className="lg:basis-80 hidden lg:mt-3 lg:block">
          <Filters searchParams={searchParams} />
        </aside>
        <main className="flex-1">
          <ScrollArea className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-5rem)]">
            <div className="pl-4 lg:pl-0 pr-4">
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
