import { Suspense, cache, memo, use, useState } from "react";
import { useHits, useInfiniteHits } from "react-instantsearch";

import Loading from "@/app/loading";
import { PostHit, PostHitResults } from "@/services/post";
import ResultImage from "./result-image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePopup } from "@/providers/popup-provider";
import { Button } from "@/components/ui/button";
import { useEbook } from "@/providers/ebook-provider";

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

function ResultCard(post: PostHitResults[number]) {
  return (
    <article
      key={post.id}
      className="rounded-2xl overflow-hidden shadow-lg md:basis-1/3 lg:basis-1/4"
    >
      <div
        className="relative aspect-video rounded-inherit border-border border"
        onClick={() => usePopup.getState().open(post)}
      >
        <ResultImage
          src={post.imageUrl!}
          alt={post.book}
          fill
          next
          className="rounded-inherit object-cover"
          onClick={(e) => e.preventDefault()}
        />
      </div>
      <div className="flex items-center justify-between text-white bg-card-result px-3 py-2">
        <div>
          <span className="text-[0.5rem] leading-none">Page {post.page}</span>
          <h6 className="text-xs leading-none mt-px">{post.book}</h6>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="text-xs h-7 py-0.5 leading-none rounded-full"
          onClick={() => useEbook.getState().open(post)}
        >
          See as book formet
        </Button>
        <p className="text-xs px-2 py-1 rounded-full leading-none">
          {post.chapter}
        </p>
      </div>
    </article>
  );
}

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
  const { hits } = useHits<PostHit>({ escapeHTML: true });
  const ids = hits.map((hit) => hit.objectID);

  return (
    <Suspense fallback={<Loading />}>
      <HitReslts ids={ids} />
    </Suspense>
  );
}
