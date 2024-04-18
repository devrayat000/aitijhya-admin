"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, cache, memo, use } from "react";
import { useHits, useInfiniteHits } from "react-instantsearch";

import Loading from "@/app/loading";
import { PostHit, PostHitResults } from "@/services/post";
import SearchHistory from "./search-history";
import ResultCard from "./result-card";
import { Button } from "@/components/ui/button";

const getHitPostsByIds = cache(async (ids: string) => {
  if (ids.length === 0) {
    return { posts: null };
  }
  const response = await fetch(`/api/posts?ids=${ids}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return response.json();
});

const HitReslts = memo(({ ids }: { ids: string }) => {
  const { posts } = use<{ posts?: PostHitResults | null }>(
    getHitPostsByIds(ids)
  );

  return (
    <section className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
      {posts ? (
        posts.map((hit) => <ResultCard isStatic key={hit.id} {...hit} />)
      ) : (
        <div className="flex justify-center">
          <p>Nothing found... 😓</p>
        </div>
      )}
    </section>
  );
});
HitReslts.displayName = "HitResults";

export default function Hits() {
  const {
    hits,
    results,
    // currentPageHits, showMore, isLastPage
  } = useHits<PostHit>({
    escapeHTML: true,
  });
  const ids = hits.map((hit) => hit.objectID) || [];

  const searchParams = useSearchParams();
  const isSearchMode =
    searchParams.has("q") && !!searchParams.get("q") && !!results?.query;

  if (!isSearchMode) {
    return (
      <Suspense fallback={<Loading />}>
        <SearchHistory />
      </Suspense>
    );
  }

  const encodedIds = ids.map((id) => encodeURIComponent(id.trim())).join(",");

  return (
    <Suspense fallback={<Loading />}>
      <HitReslts ids={encodedIds} />
      {/* {!isLastPage && (
        <div className="flex justify-end items-center pb-2">
          <Button onClick={showMore}>Show More</Button>
        </div>
      )} */}
    </Suspense>
  );
}
