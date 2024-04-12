import { Suspense, cache, memo, use } from "react";
import { useInfiniteHits } from "react-instantsearch";

import Loading from "@/app/loading";
import { PostHit, PostHitResults } from "@/services/post";
import SearchHistory from "./search-history";
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
    <section className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
      {posts?.map((hit) => (
        <ResultCard key={hit.id} {...hit} />
      ))}
    </section>
  );
});
HitReslts.displayName = "HitResults";

export default function Hits() {
  const { hits, results, showMore } = useInfiniteHits<PostHit>({
    escapeHTML: true,
    transformItems: (items) => items.filter((item) => item.objectID),
  });
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
