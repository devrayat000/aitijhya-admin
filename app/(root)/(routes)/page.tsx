"use client";

import createClient from "algoliasearch/lite";
import { SearchBox } from "./components/search-box";
import Hits from "./components/results";
import { InstantSearch } from "react-instantsearch";
// import { InstantSearchNext } from "react-instantsearch-nextjs";

const algoliaClient = createClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

export const dynamic = "force-dynamic";

const SetupPage = () => {
  return (
    <InstantSearch
      searchClient={algoliaClient}
      indexName="posts"
      routing
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <div className="Container m-4">
        <div className="mt-20">
          <SearchBox />
          {/* <RefinementList attribute="chapter.name" /> */}
        </div>
        <div className="mt-12">
          <Hits />
        </div>
      </div>
    </InstantSearch>
  );
};

export default SetupPage;
