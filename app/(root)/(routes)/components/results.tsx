import { Suspense, cache, memo, use, useState } from "react";
import { useHits, useInfiniteHits } from "react-instantsearch";

import Loading from "@/app/loading";
import { PostHit, PostHitResults } from "@/services/post";
import ResultImage from "./result-image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePopup } from "@/providers/popup-provider";
import { Button } from "@/components/ui/button";
import { useEbook } from "@/providers/ebook-provider";
import { getCurrentUserSearchHistory } from "@/services/history";
import SearchHistory from "./search-history";
import BookmarkButton from "./bookmark";
import ResultCard from "./result-card";

const getHitPostsByIds = cache(async (ids: string[]) => {
  if (ids.length === 0) {
    return { posts: [] };
  }
  const encodedIds = ids.map((id) => encodeURIComponent(id.trim())).join(",");
  const response = await fetch(`/api/posts?ids=${encodedIds}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return response.json();
});

const HitReslts = memo(({ ids }: { ids: string[] }) => {
  const { posts } = use<{ posts?: PostHitResults }>(getHitPostsByIds(ids));

  return (
    <section className="flex flex-col md:flex-row gap-4">
      {posts?.map((hit) => (
        <ResultCard key={hit.id} {...hit} />
      ))}
    </section>
  );
});
HitReslts.displayName = "HitResults";

export default function Hits() {
  const { hits, results } = useHits<PostHit>({ escapeHTML: true });
  const ids = hits.map((hit) => hit.objectID);

  if (!results?.query) {
    return (
      <Suspense fallback={<Loading />}>
        <SearchHistory />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <HitReslts ids={ids} />
    </Suspense>
  );
}
