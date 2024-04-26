"use client";

import createClient from "algoliasearch/lite";
import {
  InstantSearch,
  InstantSearchSSRProvider,
  SearchBox,
  UseConfigureProps,
  useConfigure,
} from "react-instantsearch";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// import { SearchBox } from "./search-box";
import Hits from "./results";
import logoSingle from "@/assets/logo_single.png";
import { useSearchMode } from "@/hooks/use-search-mode";
import { Suspense } from "react";
// import { InstantSearchNext } from "react-instantsearch-nextjs";
import {
  InstantSearchNext,
  InstantSearchNextRouting,
} from "react-instantsearch-nextjs";
import { history } from "instantsearch.js/es/lib/routers";
import { UiState } from "instantsearch.js";

const algoliaClient = createClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

// Returns a slug from the category name.
// Spaces are replaced by "+" to make
// the URL easier to read and other
// characters are encoded.
function getCategorySlug(name) {
  return name.split(" ").map(encodeURIComponent).join("+");
}

// Returns a name from the category slug.
// The "+" are replaced by spaces and other
// characters are decoded.
function getCategoryName(slug) {
  return slug.split("+").map(decodeURIComponent).join(" ");
}

const routing: InstantSearchNextRouting<UiState, UiState> = {
  router: history({
    cleanUrlOnDispose: false,
    windowTitle({ category, query }) {
      const queryTitle = query ? `Results for "${query}"` : "Search";

      if (category) {
        return `${category} – ${queryTitle}`;
      }

      return queryTitle;
    },

    createURL({ qsModule, routeState, location }) {
      const urlParts = location.href.match(/^(.*?)\/search/);
      const baseUrl = `${urlParts ? urlParts[1] : ""}/`;

      const categoryPath = routeState.category
        ? `${getCategorySlug(routeState.category)}/`
        : "";
      const queryParameters = {};

      if (routeState.query) {
        queryParameters.query = encodeURIComponent(routeState.query);
      }
      if (routeState.page !== 1) {
        queryParameters.page = routeState.page;
      }
      if (routeState.brands) {
        queryParameters.brands = routeState.brands.map(encodeURIComponent);
      }

      const queryString = qsModule.stringify(queryParameters, {
        addQueryPrefix: true,
        arrayFormat: "repeat",
      });

      return `${baseUrl}search/${categoryPath}${queryString}`;
    },

    parseURL({ qsModule, location }) {
      const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);
      const category = getCategoryName(pathnameMatches?.[1] || "");
      const {
        query = "",
        page,
        brands = [],
      } = qsModule.parse(location.search.slice(1));
      // `qs` does not return an array when there's a single value.
      const allBrands = Array.isArray(brands)
        ? brands
        : [brands].filter(Boolean);

      return {
        query: decodeURIComponent(query),
        page,
        brands: allBrands.map(decodeURIComponent),
        category,
      };
    },
    getLocation() {
      return window.location;
    },
  }),

  stateMapping: {
    stateToRoute(uiState) {
      const indexUiState = uiState["instant_search"] || {};

      return {
        query: indexUiState.query,
        page: indexUiState.page,
        brands: indexUiState.refinementList?.brand,
        category: indexUiState.menu?.categories,
      };
    },

    routeToState(routeState) {
      return {
        instant_search: {
          query: routeState.query,
          page: routeState.page,
          menu: {
            categories: routeState.category,
          },
          refinementList: {
            brand: routeState.brands,
          },
        },
      };
    },
  },
};

export const dynamic = "force-dynamic";

function Configure(props: UseConfigureProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useConfigure({
    hitsPerPage: 24,
    query: searchQuery,
    optionalWords: [searchQuery],
    attributesToRetrieve: ["objectID"],
    ...props,
  });

  return null;
}

const SetupPage = () => {
  // const router = useRouter();
  return (
    <div>
      {/* <InstantSearchSSRProvider initialResults={{}}></InstantSearchSSRProvider> */}
      <InstantSearchNext
        searchClient={algoliaClient}
        indexName="posts"
        future={{ preserveSharedStateOnUnmount: true }}
        routing={routing}
      >
        <div className="pt-4">
          {/* <Suspense>
            <Configure /> */}
          <SearchBox />
          {/* <SearchBox /> */}
          {/* </Suspense> */}
          {/* <RefinementList attribute="chapter.name" /> */}
        </div>
        {/* <div className="mt-6">
          <Hits />
        </div> */}
      </InstantSearchNext>
    </div>
  );
};

function SearchTrigger() {
  return (
    <div className="h-full grid place-items-center">
      <div className="w-full -mt-72 max-w-[52rem] mx-auto">
        <motion.div layoutId="search-icon" className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={200} />
        </motion.div>
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

  console.log({ isSearchMode });

  return (
    <div className="p-4 h-screen" suppressHydrationWarning>
      <SetupPage key="search" />
    </div>
  );
}

// export default SetupPage;
