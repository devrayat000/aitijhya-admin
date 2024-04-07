"use client";

import createClient from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { SearchBox } from "../components/search-box";
import Hits from "../components/results";
import logoSingle from "@/assets/logo_single.png";
import { useSearchMode } from "@/hooks/use-search-mode";
import { Suspense } from "react";
// import { InstantSearchNext } from "react-instantsearch-nextjs";

const algoliaClient = createClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

export const dynamic = "force-dynamic";

const SetupPage = () => {
  return (
    <div>
      <InstantSearch
        searchClient={algoliaClient}
        indexName="posts"
        // routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <div className="pt-4">
          <Suspense>
            <SearchBox />
          </Suspense>
          {/* <RefinementList attribute="chapter.name" /> */}
        </div>
        <div className="mt-6">
          <Hits />
        </div>
      </InstantSearch>
    </div>
  );
};

function SearchTrigger() {
  return (
    <div className="h-full grid place-items-center">
      <div className="w-full -mt-36">
        <div className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={200} />
        </div>
        <motion.button
          onClick={useSearchMode.getState().open}
          layoutId="search-input"
          id="dummy-search"
          className="w-full font-medium text-slate-400 cursor-pointer px-10 flex items-center h-12 rounded-full border border-input bg-input py-2 text-sm"
        >
          Search
        </motion.button>
      </div>
    </div>
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const searchMode = useSearchMode((state) => state.searchMode);
  const isSearchMode =
    (searchParams.has("q") && !!searchParams.get("q")) || searchMode;

  return (
    <div className="p-4 h-screen" suppressHydrationWarning>
      <AnimatePresence initial={false}>
        {isSearchMode ? (
          <SetupPage key="search" />
        ) : (
          <SearchTrigger key="trigger" />
        )}
      </AnimatePresence>
    </div>
  );
}

// export default SetupPage;
